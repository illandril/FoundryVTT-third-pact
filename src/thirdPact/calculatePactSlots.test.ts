import calculatePactSlots from './calculatePactSlots';

describe.each([
  [1, 1, 1],
  [2, 1, 2],
  [3, 2, 2],
  [4, 2, 2],
  [5, 3, 2],
  [6, 3, 2],
  [7, 4, 2],
  [8, 4, 2],
  [9, 5, 2],
  [10, 5, 2],
  [11, 5, 3],
  [12, 5, 3],
  [13, 5, 3],
  [14, 5, 3],
  [15, 5, 3],
  [16, 5, 3],
  [17, 5, 4],
  [18, 5, 4],
  [19, 5, 4],
  [20, 5, 4],
  [30, 5, 4],
])('for effectivePactLevel=%i, expectedSlotLevel: %i, expectedSlotCount: %i', (effectivePactLevel, expectedSlotLevel, expectedSlotCount) => {
  it('sets the correct pact.max', () => {
    const spells: Spells = {
      pact: {
        level: 0,
        max: 0,
        value: 0,
      },
    };

    calculatePactSlots(spells, effectivePactLevel);

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

    calculatePactSlots(spells, effectivePactLevel);

    expect(spells.pact?.level).toBe(expectedSlotLevel);
  });

  it('creates pact object if it does not already exist', () => {
    const spells: Spells = {};

    calculatePactSlots(spells, effectivePactLevel);

    expect(spells.pact).toBeDefined();
    expect(spells.pact?.level).toBe(expectedSlotLevel);
    expect(spells.pact?.max).toBe(expectedSlotCount);
  });

  it('reduces pact.value to the expectedSlotCount when it is greater', () => {
    const spells: Spells = {
      pact: {
        level: 0,
        max: 0,
        value: 5,
      },
    };

    calculatePactSlots(spells, effectivePactLevel);

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

    calculatePactSlots(spells, effectivePactLevel);

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

    calculatePactSlots(spells, effectivePactLevel);

    expect(spells.pact?.value).toBe(0);
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])('uses the defined override for pact.max (%i)', (override) => {
    const spells: Spells = {
      pact: {
        override,
      },
    };

    calculatePactSlots(spells, effectivePactLevel);

    expect(spells.pact?.override).toBe(override);
    expect(spells.pact?.max).toBe(override);
    expect(spells.pact?.level).toBe(expectedSlotLevel);
  });
});
