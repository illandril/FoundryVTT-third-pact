import './addSpellProgressions';
import './computeProgression';
import { leveledRoundingMode } from './settings';

beforeAll(() => {
  Hooks.callAll('init');
  Hooks.callAll('ready');
});

describe('computPactProgression', () => {
  it('should return false w/o modifying progression if spellcasting.progression is undefined', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 10,
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 2,
    });
  });

  it('should return false w/o modifying progression if spellcasting.progression is a custom pact type', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 10,
        progression: 'illandril_custompact_a',
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 2,
    });
  });

  it('should return true w/o modifying progression if spellcasting.progression is the standard pact type', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 10,
        progression: 'pact',
        type: 'pact',
      },
      1,
    );

    expect(result).toBe(true);
    expect(progression).toEqual({
      slot: 1,
      pact: 2,
    });
  });

  it('should return false and modify progression if spellcasting.progression is third pact type (level = 9)', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 9,
        progression: 'illandril_thirdpact',
        type: 'pact',
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 5,
    });
  });

  it('should return false and modify progression if spellcasting.progression is quarter pact type (level = 12)', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 12,
        progression: 'illandrilPactQuarter',
        type: 'pact',
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 5,
    });
  });

  it('should return false and modify progression if spellcasting.progression is half pact type (level = 12)', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 12,
        progression: 'illandrilPactHalf',
        type: 'pact',
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 8,
    });
  });

  it('should return false and modify progression if spellcasting.progression is two thirds pact type (level = 12)', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 12,
        progression: 'illandrilPactTwoThirds',
        type: 'pact',
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 10,
    });
  });

  it('should return false and modify progression if spellcasting.progression is three quarter pact type (level = 12)', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computePactProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 12,
        progression: 'illandrilPactThreeQuarters',
        type: 'pact',
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 11,
    });
  });

  it.todo('rounding modes');
});

describe('computeLeveledProgression', () => {
  it('should return false w/o modifying progression if spellcasting.progression is undefined', () => {
    const progression = {
      slot: 1,
      pact: 2,
    };
    const result = Hooks.call(
      'dnd5e.computeLeveledProgression',
      progression,
      {} as dnd5e.documents.Actor5e,
      {} as dnd5e.documents.Item5e,
      {
        ability: 'cha',
        levels: 10,
      },
      1,
    );

    expect(result).toBe(false);
    expect(progression).toEqual({
      slot: 1,
      pact: 2,
    });
  });

  describe('roundingMode = system', () => {
    beforeEach(() => {
      leveledRoundingMode.set('system');
    });
    it('should return true without modifying progression', () => {
      const progression = {
        slot: 1,
        pact: 2,
      };
      const result = Hooks.call(
        'dnd5e.computeLeveledProgression',
        progression,
        {} as dnd5e.documents.Actor5e,
        {} as dnd5e.documents.Item5e,
        {
          ability: 'int',
          levels: 12,
          progression: 'illandrilQuarter',
          type: 'leveled',
        },
        1,
      );

      expect(result).toBe(true);
      expect(progression).toEqual({
        slot: 1,
        pact: 2,
      });
    });
  });

  describe('roundingMode = down', () => {
    beforeEach(() => {
      leveledRoundingMode.set('down');
    });

    it('should return false and modify progression if spellcasting.progression is quarter type (level = 12)', () => {
      const progression = {
        slot: 1,
        pact: 2,
      };
      const result = Hooks.call(
        'dnd5e.computeLeveledProgression',
        progression,
        {} as dnd5e.documents.Actor5e,
        {} as dnd5e.documents.Item5e,
        {
          ability: 'int',
          levels: 12,
          progression: 'illandrilQuarter',
          type: 'leveled',
        },
        1,
      );

      expect(result).toBe(false);
      expect(progression).toEqual({
        slot: 4,
        pact: 2,
      });
    });

    it('should return false and modify progression if spellcasting.progression is two thirds type (level = 12)', () => {
      const progression = {
        slot: 1,
        pact: 2,
      };
      const result = Hooks.call(
        'dnd5e.computeLeveledProgression',
        progression,
        {} as dnd5e.documents.Actor5e,
        {} as dnd5e.documents.Item5e,
        {
          ability: 'int',
          levels: 12,
          progression: 'illandrilTwoThirds',
          type: 'leveled',
        },
        1,
      );

      expect(result).toBe(false);
      expect(progression).toEqual({
        slot: 9,
        pact: 2,
      });
    });

    it('should return false and modify progression if spellcasting.progression is quarter type (level = 11)', () => {
      const progression = {
        slot: 1,
        pact: 2,
      };
      const result = Hooks.call(
        'dnd5e.computeLeveledProgression',
        progression,
        {} as dnd5e.documents.Actor5e,
        {} as dnd5e.documents.Item5e,
        {
          ability: 'int',
          levels: 11,
          progression: 'illandrilThreeQuarters',
          type: 'leveled',
        },
        1,
      );

      expect(result).toBe(false);
      expect(progression).toEqual({
        slot: 9,
        pact: 2,
      });
    });

    it('should return false and modify progression if spellcasting.progression is quarter type (level = 12)', () => {
      const progression = {
        slot: 1,
        pact: 2,
      };
      const result = Hooks.call(
        'dnd5e.computeLeveledProgression',
        progression,
        {} as dnd5e.documents.Actor5e,
        {} as dnd5e.documents.Item5e,
        {
          ability: 'int',
          levels: 12,
          progression: 'illandrilThreeQuarters',
          type: 'leveled',
        },
        1,
      );

      expect(result).toBe(false);
      expect(progression).toEqual({
        slot: 10,
        pact: 2,
      });
    });

    it('should return false and modify progression if spellcasting.progression is quarter type (level = 13)', () => {
      const progression = {
        slot: 1,
        pact: 2,
      };
      const result = Hooks.call(
        'dnd5e.computeLeveledProgression',
        progression,
        {} as dnd5e.documents.Actor5e,
        {} as dnd5e.documents.Item5e,
        {
          ability: 'int',
          levels: 13,
          progression: 'illandrilThreeQuarters',
          type: 'leveled',
        },
        1,
      );

      expect(result).toBe(false);
      expect(progression).toEqual({
        slot: 10,
        pact: 2,
      });
    });
  });

  it.todo('other rounding modes');
});

// Hooks.on('dnd5e.computeLeveledProgression', (progression, _actor, _cls, spellcasting, count) => {
