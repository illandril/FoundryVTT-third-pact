import * as classes from '../tests/data/classes';
import { mockActor } from '../tests/mockHelpers';
import calculateCustomPactSlots from './calculateCustomPactSlots';
import calculatePactSlots from './calculatePactSlots';
import derivePactSlots from './derivePactSlots';
import { roundingMode } from './settings';

jest.mock('./calculateCustomPactSlots');
jest.mock('./calculatePactSlots');

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
  expect(calculatePactSlots).not.toHaveBeenCalled();
});

it('does nothing for non-spellcasters', () => {
  const actor = mockActor([classes.nonCaster(5), classes.nonCaster(6), classes.nonCaster(2)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).not.toHaveBeenCalled();
});

it('does nothing for full-pact only spellcasters', () => {
  const actor = mockActor([classes.fullPact(9)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).not.toHaveBeenCalled();
});

it('does nothing for actors missing spells data', () => {
  const actor = mockActor([classes.customPactA(9)], { type: 'character', system: {} });

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).not.toHaveBeenCalled();
});

it('calls only calculateCustomPactSlots for single-class custom pact casters', () => {
  const actor = mockActor([classes.customPactA(5)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculatePactSlots).not.toHaveBeenCalled();
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

  expect(calculatePactSlots).not.toHaveBeenCalled();
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

it('calls only calculatePactSlots for single-class third pact casters (level = 9)', () => {
  const actor = mockActor([classes.thirdPact(9)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).toHaveBeenCalledTimes(1);
  expect(calculatePactSlots).toHaveBeenCalledWith(
    {
      pact: {
        level: 4,
        max: 3,
        value: 2,
      },
    },
    3,
  );
});

it('calls only calculatePactSlots for single-class third pact casters (level = 8, round = down)', () => {
  roundingMode.set('down');
  const actor = mockActor([classes.thirdPact(8)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).toHaveBeenCalledTimes(1);
  expect(calculatePactSlots).toHaveBeenCalledWith(
    {
      pact: {
        level: 4,
        max: 3,
        value: 2,
      },
    },
    2,
  );
});

it('calls only calculatePactSlots for single-class third pact casters (level = 8, round = up)', () => {
  roundingMode.set('up');
  const actor = mockActor([classes.thirdPact(8)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).toHaveBeenCalledTimes(1);
  expect(calculatePactSlots).toHaveBeenCalledWith(
    {
      pact: {
        level: 4,
        max: 3,
        value: 2,
      },
    },
    3,
  );
});

it('calls only calculatePactSlots for multi-class third pact casters (level = 2, 5, 8)', () => {
  const actor = mockActor([classes.thirdPact(2), classes.thirdPact(5), classes.thirdPact(8)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).toHaveBeenCalledTimes(1);
  expect(calculatePactSlots).toHaveBeenCalledWith(
    {
      pact: {
        level: 4,
        max: 3,
        value: 2,
      },
    },
    5,
  );
});

it('calls only calculatePactSlots for multi-class full + third pact casters (level = 4 full, 9 third)', () => {
  const actor = mockActor([classes.fullPact(4), classes.thirdPact(9)], actorProps('character'));

  derivePactSlots(actor);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
  expect(calculatePactSlots).toHaveBeenCalledTimes(1);
  expect(calculatePactSlots).toHaveBeenCalledWith(
    {
      pact: {
        level: 4,
        max: 3,
        value: 2,
      },
    },
    7,
  );
});
