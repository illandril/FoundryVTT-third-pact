import * as classes from '../tests/data/classes';
import { mockActor } from '../tests/mockHelpers';
import calculateCustomPactSlots from './calculateCustomPactSlots';
import { customPactTypes } from './settings';
import './preparePactSlots';

jest.mock('./calculateCustomPactSlots');

beforeAll(() => {
  Hooks.callAll('init');
  customPactTypes[0].setting.set(
    JSON.stringify([
      {
        classLevel: 1,
        slots: 2,
        spellLevel: 3,
      },
    ]),
  );
});

it('uses calculateCustomPactSlots on preparePactSlots and disallows default preparation for custom pact classes', () => {
  const spells = { pact: {} };
  const actor = mockActor([classes.customPactA(5)]);

  const actual = Hooks.call('dnd5e.preparePactSlots', spells, actor, { slot: 99, pact: 99 });
  expect(actual).toBe(false);

  expect(calculateCustomPactSlots).toHaveBeenCalledTimes(1);
  expect(calculateCustomPactSlots).toHaveBeenCalledWith(spells, 5, customPactTypes[0]);
});

it.each(['fullPact', 'thirdPact'] as const)('uses default preparation on preparePactSlots for %j class', (cls) => {
  const spells = { pact: {} };
  const actor = mockActor([classes[cls](5)]);

  const actual = Hooks.call('dnd5e.preparePactSlots', spells, actor, { slot: 99, pact: 99 });
  expect(actual).toBe(true);

  expect(calculateCustomPactSlots).not.toHaveBeenCalled();
});
