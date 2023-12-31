import calculateCustomPactSlots from './calculateCustomPactSlots';
import { customPactTypes } from './settings';

beforeAll(() => {
  Hooks.callAll('init');
});

it('uses the correct custom class definition', () => {
  customPactTypes[0].setting.set('[{"slots":1,"spellLevel":1}]');
  customPactTypes[1].setting.set('[{"slots":2,"spellLevel":2}]');
  customPactTypes[2].setting.set('[{"slots":3,"spellLevel":3}]');

  const spellsA: Spells = { pact: {} };
  const spellsB: Spells = { pact: {} };
  const spellsC: Spells = { pact: {} };

  calculateCustomPactSlots(spellsA, 1, customPactTypes[0]);
  calculateCustomPactSlots(spellsB, 1, customPactTypes[1]);
  calculateCustomPactSlots(spellsC, 1, customPactTypes[2]);

  expect(spellsA.pact?.level).toBe(1);
  expect(spellsB.pact?.level).toBe(2);
  expect(spellsC.pact?.level).toBe(3);
});

it.each(['', 'my cool class'])('fails gracefully for non-JSON definitions (%s)', (definition) => {
  const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

  customPactTypes[0].setting.set(definition);
  const spells: Spells = { pact: {} };

  calculateCustomPactSlots(spells, 1, customPactTypes[0]);

  expect(spells.pact?.level).toBe(1);
  expect(spells.pact?.max).toBe(0);

  expect(errorSpy).toHaveBeenCalledTimes(1);
  expect(errorSpy).toHaveBeenCalledWith(
    expect.stringContaining('Illandril\'s Pact Slot Third Caster'),
    expect.stringContaining('background-color'),
    'Error parsing custom Pact options',
    'illandril_custompact_a',
    definition,
    expect.any(Error),
  );
});

it('fails gracefully if type is missing slots', () => {
  customPactTypes[0].setting.set('[{"spellLevel":3}]');
  const spells: Spells = { pact: {} };

  calculateCustomPactSlots(spells, 1, customPactTypes[0]);

  expect(spells.pact?.level).toBe(3);
  expect(spells.pact?.max).toBe(0);
});

it('fails gracefully if type is missing spell level', () => {
  customPactTypes[0].setting.set('[{"slots":3}]');
  const spells: Spells = { pact: {} };

  calculateCustomPactSlots(spells, 1, customPactTypes[0]);

  expect(spells.pact?.level).toBe(1);
  expect(spells.pact?.max).toBe(3);
});

it.each([0, -1, -5, -10])('fails gracefully if type class level is %i', (level) => {
  customPactTypes[0].setting.set('[{"slots":3,"spellLevel":3}]');
  const spells: Spells = { pact: {} };

  calculateCustomPactSlots(spells, level, customPactTypes[0]);

  expect(spells.pact?.level).toBe(1);
  expect(spells.pact?.max).toBe(0);
});

it('uses last specified level if all levels not included', () => {
  customPactTypes[0].setting.set('[{"spellLevel": 1, "slots":1},{"spellLevel": 2, "slots":2},{"spellLevel": 3, "slots":3}]');
  const spells: Spells = { pact: {} };

  calculateCustomPactSlots(spells, 15, customPactTypes[0]);

  expect(spells.pact?.level).toBe(3);
  expect(spells.pact?.max).toBe(3);
});

describe('every level different', () => {
  const customPactType = customPactTypes[0];
  beforeAll(() => {
    const definition = Array.from({ length: 20 }, (_value, index) => {
      return { slots: index * 2 + 2, spellLevel: index * 2 + 1 };
    });
    customPactType.setting.set(JSON.stringify(definition));
  });


  describe.each([
    [1, 1, 2],
    [2, 3, 4],
    [3, 5, 6],
    [4, 7, 8],
    [5, 9, 10],
    [6, 11, 12],
    [7, 13, 14],
    [8, 15, 16],
    [9, 17, 18],
    [10, 19, 20],
    [11, 21, 22],
    [12, 23, 24],
    [13, 25, 26],
    [14, 27, 28],
    [15, 29, 30],
    [16, 31, 32],
    [17, 33, 34],
    [18, 35, 36],
    [19, 37, 38],
    [20, 39, 40],
    [30, 39, 40],
  ])('for level=%i, expectedSlotLevel: %i, expectedSlotCount: %i', (level, expectedSlotLevel, expectedSlotCount) => {
    it('sets the correct pact.max', () => {
      const spells: Spells = {
        pact: {
          level: 0,
          max: 0,
          value: 0,
        },
      };

      calculateCustomPactSlots(spells, level, customPactType);

      expect(spells.pact?.max).toBe(expectedSlotCount);
    });

    it('sets the correct pact.level', () => {
      const spells: Spells = {
        pact: {
          level: 0,
          max: 0,
          value: 0,
        },
      };

      calculateCustomPactSlots(spells, level, customPactType);

      expect(spells.pact?.level).toBe(expectedSlotLevel);
    });

    it('creates pact object if it does not already exist', () => {
      const spells: Spells = {};

      calculateCustomPactSlots(spells, level, customPactType);

      expect(spells.pact).toBeDefined();
      expect(spells.pact?.level).toBe(expectedSlotLevel);
      expect(spells.pact?.max).toBe(expectedSlotCount);
    });

    it('reduces pact.value to the expectedSlotCount when it is greater', () => {
      const spells: Spells = {
        pact: {
          level: 0,
          max: 0,
          value: 99,
        },
      };

      calculateCustomPactSlots(spells, level, customPactType);

      expect(spells.pact?.value).toBe(expectedSlotCount);
    });

    it.each([0, 1, 2, 3, 4])('leaves pact.value (%i) unchanged when it is below or equal to the expectedSlotCount', (value) => {
      const spells: Spells = {
        pact: {
          level: 0,
          max: 0,
          value,
        },
      };

      calculateCustomPactSlots(spells, level, customPactType);

      if (value < expectedSlotCount) {
        expect(spells.pact?.value).toBe(value);
      } else {
        expect(spells.pact?.value).toBe(expectedSlotCount);
      }
    });

    it('sets pact.value to 0 when it is undefined', () => {
      const spells: Spells = {
        pact: {
          level: 0,
          max: 0,
        },
      };

      calculateCustomPactSlots(spells, level, customPactType);

      expect(spells.pact?.value).toBe(0);
    });

    it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('uses the defined override for pact.max (%i)', (override) => {
      const spells: Spells = {
        pact: {
          override,
        },
      };

      calculateCustomPactSlots(spells, level, customPactType);

      expect(spells.pact?.override).toBe(override);
      expect(spells.pact?.max).toBe(override);
      expect(spells.pact?.level).toBe(expectedSlotLevel);
    });
  });
});

describe('requested class definitions', () => {
  const customPactType = customPactTypes[0];

  describe('justinpurdy\'s class', () => {
    beforeAll(() => {
      customPactType.setting.set('[{"slots":1,"spellLevel":1},{"slots":2,"spellLevel":1},{"slots":2,"spellLevel":1},{"slots":2,"spellLevel":2},{"slots":3,"spellLevel":2},{"slots":3,"spellLevel":3},{"slots":3,"spellLevel":3},{"slots":3,"spellLevel":3},{"slots":3,"spellLevel":4},{"slots":3,"spellLevel":4},{"slots":4,"spellLevel":4},{"slots":4,"spellLevel":4},{"slots":4,"spellLevel":4},{"slots":4,"spellLevel":5},{"slots":4,"spellLevel":5},{"slots":4,"spellLevel":5},{"slots":5,"spellLevel":5},{"slots":5,"spellLevel":5},{"slots":5,"spellLevel":5},{"slots":5,"spellLevel":5}]');
    });

    describe.each([
      [1, 1, 1],
      [2, 1, 2],
      [3, 1, 2],
      [4, 2, 2],
      [5, 2, 3],
      [6, 3, 3],
      [7, 3, 3],
      [8, 3, 3],
      [9, 4, 3],
      [10, 4, 3],
      [11, 4, 4],
      [12, 4, 4],
      [13, 4, 4],
      [14, 5, 4],
      [15, 5, 4],
      [16, 5, 4],
      [17, 5, 5],
      [18, 5, 5],
      [19, 5, 5],
      [20, 5, 5],
      [30, 5, 5],
    ])('for level=%i, expectedSlotLevel: %i, expectedSlotCount: %i', (level, expectedSlotLevel, expectedSlotCount) => {
      it('sets the correct pact.max', () => {
        const spells: Spells = {
          pact: {
            level: 0,
            max: 0,
            value: 0,
          },
        };

        calculateCustomPactSlots(spells, level, customPactType);

        expect(spells.pact?.max).toBe(expectedSlotCount);
      });

      it('sets the correct pact.level', () => {
        const spells: Spells = {
          pact: {
            level: 0,
            max: 0,
            value: 0,
          },
        };

        calculateCustomPactSlots(spells, level, customPactType);

        expect(spells.pact?.level).toBe(expectedSlotLevel);
      });
    });
  });

  describe('beorod\'s class', () => {
    beforeAll(() => {
      customPactType.setting.set('[{"slots":0,"spellLevel":1},{"slots":1,"spellLevel":1},{"slots":1,"spellLevel":1},{"slots":1,"spellLevel":1},{"slots":2,"spellLevel":2},{"slots":2,"spellLevel":2},{"slots":2,"spellLevel":2},{"slots":2,"spellLevel":2},{"slots":2,"spellLevel":3},{"slots":2,"spellLevel":3},{"slots":2,"spellLevel":3},{"slots":2,"spellLevel":3},{"slots":3,"spellLevel":4},{"slots":3,"spellLevel":4},{"slots":3,"spellLevel":4},{"slots":3,"spellLevel":4},{"slots":3,"spellLevel":5},{"slots":3,"spellLevel":5},{"slots":3,"spellLevel":5},{"slots":3,"spellLevel":5}]');
    });

    describe.each([
      [1, 1, 0],
      [2, 1, 1],
      [3, 1, 1],
      [4, 1, 1],
      [5, 2, 2],
      [6, 2, 2],
      [7, 2, 2],
      [8, 2, 2],
      [9, 3, 2],
      [10, 3, 2],
      [11, 3, 2],
      [12, 3, 2],
      [13, 4, 3],
      [14, 4, 3],
      [15, 4, 3],
      [16, 4, 3],
      [17, 5, 3],
      [18, 5, 3],
      [19, 5, 3],
      [20, 5, 3],
      [30, 5, 3],
    ])('for level=%i, expectedSlotLevel: %i, expectedSlotCount: %i', (level, expectedSlotLevel, expectedSlotCount) => {
      it('sets the correct pact.max', () => {
        const spells: Spells = {
          pact: {
            level: 0,
            max: 0,
            value: 0,
          },
        };

        calculateCustomPactSlots(spells, level, customPactType);

        expect(spells.pact?.max).toBe(expectedSlotCount);
      });

      it('sets the correct pact.level', () => {
        const spells: Spells = {
          pact: {
            level: 0,
            max: 0,
            value: 0,
          },
        };

        calculateCustomPactSlots(spells, level, customPactType);

        expect(spells.pact?.level).toBe(expectedSlotLevel);
      });
    });
  });
});
