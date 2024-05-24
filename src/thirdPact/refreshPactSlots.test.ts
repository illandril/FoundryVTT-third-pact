import * as classes from '../tests/data/classes';

jest.mock('./derivePactSlots');

const basePrepareDerivedData = jest.fn();
const baseRender = jest.fn();

class Actor5e {
  constructor(
    public type: string,
    public items: dnd5e.documents.Item5e[],
  ) {
    // Nothing to initialize except the public variables
  }

  prepareDerivedData(...args: unknown[]) {
    basePrepareDerivedData(this, ...args);
  }

  render(...args: unknown[]) {
    baseRender(this, ...args);
  }
}

const getMockActor = (index: number) => {
  return (game.actors as unknown as Actor5e[])[index];
};

let derivePactSlots: jest.Mock;
beforeEach(async () => {
  jest.resetModules();

  // basePrepareDerivedData);
  // baseRender = jest.fn();

  dnd5e.documents = {
    Actor5e,
  } as unknown as typeof dnd5e.documents;

  (game as unknown as { actors: Actor5e[] }).actors = [
    new Actor5e('npc', []),
    new Actor5e('character', [classes.fullPact(1), classes.thirdPact(3)]),
    new Actor5e('npc', [classes.fullPact(1), classes.thirdPact(3)]),
    new Actor5e('character', [classes.fullCaster(5)]),
    new Actor5e('character', [classes.customPactA(5)]),
  ];

  derivePactSlots = jest.mocked((await import('./derivePactSlots')).default);
  await import('./refreshPactSlots');
  Hooks.callAll('init');
});

it('refreshes on ready', () => {
  Hooks.callAll('ready');
  expect(derivePactSlots).toHaveBeenCalledTimes(2);
  expect(derivePactSlots).toHaveBeenCalledWith(getMockActor(1));
  expect(derivePactSlots).toHaveBeenCalledWith(getMockActor(4));
  expect(baseRender).toHaveBeenCalledTimes(2);
  expect(baseRender).toHaveBeenCalledWith(getMockActor(1), false);
  expect(baseRender).toHaveBeenCalledWith(getMockActor(4), false);
  expect(basePrepareDerivedData).not.toHaveBeenCalled();
});

it('refreshes on prepareDerivedData', () => {
  Hooks.callAll('ready');
  basePrepareDerivedData.mockClear();
  derivePactSlots.mockClear();
  baseRender.mockClear();

  // Sanity check the clears
  expect(basePrepareDerivedData).not.toHaveBeenCalled();
  expect(derivePactSlots).not.toHaveBeenCalled();
  expect(baseRender).not.toHaveBeenCalled();

  getMockActor(1).prepareDerivedData();

  expect(derivePactSlots).toHaveBeenCalledWith(getMockActor(1));
  expect(derivePactSlots).toHaveBeenCalledTimes(1);
  expect(basePrepareDerivedData).toHaveBeenCalledTimes(1);
  expect(basePrepareDerivedData).toHaveBeenCalledWith(getMockActor(1));
  expect(baseRender).not.toHaveBeenCalled();
});

it('refreshes on setting changes', async () => {
  const customPactTypes = (await import('./settings')).customPactTypes;
  // Sanity check that the initialization didn't trigger any calls
  expect(basePrepareDerivedData).not.toHaveBeenCalled();
  expect(derivePactSlots).not.toHaveBeenCalled();
  expect(baseRender).not.toHaveBeenCalled();

  customPactTypes[0].setting.set(JSON.stringify([]));

  expect(derivePactSlots).toHaveBeenCalledTimes(2);
  expect(derivePactSlots).toHaveBeenCalledWith(getMockActor(1));
  expect(derivePactSlots).toHaveBeenCalledWith(getMockActor(4));
  expect(baseRender).toHaveBeenCalledTimes(2);
  expect(baseRender).toHaveBeenCalledWith(getMockActor(1), false);
  expect(baseRender).toHaveBeenCalledWith(getMockActor(4), false);
  expect(basePrepareDerivedData).not.toHaveBeenCalled();
});
