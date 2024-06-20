import * as classes from '../tests/data/classes';
import { mockActor } from '../tests/mockHelpers';
import calculateCustomPactSlots from './calculateCustomPactSlots';
import derivePactSlots from './derivePactSlots';

jest.mock('./calculateCustomPactSlots');

beforeAll(() => {
  Hooks.callAll('init');
});

const actorProps = (type: string): Partial<dnd5e.documents.Actor5e> => {
  return {
    type,
    system: {
      spells: {
        pact: {
          level: 4,
          max: 3,
          value: 2,
        },
      },
    },
  };
};

it('does nothing for non-character actors', () => {
  const actor = mockActor([classes.fullPact(5), classes.thirdPact(6), classes.customPactA(2)], actorProps('npc'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
});

it('does nothing for non-spellcasters', () => {
  const actor = mockActor([classes.nonCaster(5), classes.nonCaster(6), classes.nonCaster(2)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
});

it('does nothing for full-pact only spellcasters', () => {
  const actor = mockActor([classes.fullPact(9)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
});

it('does nothing for actors missing spells data', () => {
  const actor = mockActor([classes.customPactA(9)], { type: 'character', system: {} });

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
});

it('calls only calculateCustomPactSlots for single-class custom pact casters', () => {
  const actor = mockActor([classes.customPactA(5)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).toHaveBeenCalledTimes(1);
  expect(calculateCustomPactSlots).toHaveBeenCalledWith(
    {
      pact: {
        level: 4,
        max: 3,
        value: 2,
      },
    },
    5,
    expect.objectContaining({ key: 'illandril_custompact_a' }),
  );
});

it('calls only calculateCustomPactSlots with the first custom pact class for multi-class pact casters', () => {
  const actor = mockActor(
    [classes.fullPact(3), classes.customPactB(2), classes.customPactC(4)],
    actorProps('character'),
  );

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).toHaveBeenCalledTimes(1);
  expect(calculateCustomPactSlots).toHaveBeenCalledWith(
    {
      pact: {
        level: 4,
        max: 3,
        value: 2,
      },
    },
    2,
    expect.objectContaining({ key: 'illandril_custompact_b' }),
  );
});

it('does not call calculateCustomPactSlots for single-class third pact casters (level = 9)', () => {
  const actor = mockActor([classes.thirdPact(9)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
});
