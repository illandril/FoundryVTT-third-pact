import * as classes from '../tests/data/classes';

const basePrepareData = jest.fn();
const baseRender = jest.fn();

class Actor5e {
  constructor(
    public type: string,
    public items: dnd5e.documents.Item5e[],
  ) {
    // Nothing to initialize except the public variables
  }

  prepareData(...args: unknown[]) {
    basePrepareData(this, ...args);
  }

  render(...args: unknown[]) {
    baseRender(this, ...args);
  }
}

const getMockActor = (index: number) => {
  return (game.actors as unknown as Actor5e[])[index];
};

beforeEach(async () => {
  jest.resetModules();

  dnd5e.documents = {
    Actor5e,
  } as unknown as typeof dnd5e.documents;

  (game as unknown as { actors: Actor5e[] }).actors = [
    new Actor5e('npc', []),
    new Actor5e('character', [classes.fullPact(1), classes.thirdPact(3)]),
    new Actor5e('npc', [classes.fullPact(1), classes.thirdPact(3)]),
    new Actor5e('character', [classes.fullCaster(5)]),
    new Actor5e('character', [classes.customPactA(5)]),
    new Actor5e('character', [classes.nonCaster(5)]),
  ];

  await import('./refreshDataOnSettingChange');
  Hooks.callAll('init');
});

it('refreshes all character spellcasters on setting changes', async () => {
  const customPactTypes = (await import('./settings')).customPactTypes;

  Hooks.callAll('ready');
  basePrepareData.mockClear();
  baseRender.mockClear();

  // Sanity check the clears
  expect(basePrepareData).not.toHaveBeenCalled();
  expect(baseRender).not.toHaveBeenCalled();

  customPactTypes[0].setting.set(JSON.stringify([]));

  // prepareDerivedData called for all spellcasters
  expect(basePrepareData).toHaveBeenCalledTimes(3);
  expect(basePrepareData).toHaveBeenCalledWith(getMockActor(1));
  expect(basePrepareData).toHaveBeenCalledWith(getMockActor(3));
  expect(basePrepareData).toHaveBeenCalledWith(getMockActor(4));

  // render called for all spellcasters
  expect(baseRender).toHaveBeenCalledTimes(3);
  expect(baseRender).toHaveBeenCalledWith(getMockActor(1), false);
  expect(baseRender).toHaveBeenCalledWith(getMockActor(3), false);
  expect(baseRender).toHaveBeenCalledWith(getMockActor(4), false);
});
