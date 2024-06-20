import module from '../module';
import derivePactSlots from './derivePactSlots';
import { customPactTypes, registerSettingChangeHandler } from './settings';
import someSpellcastingClass from './someSpellcastingClass';

const refreshPactSlots = () => {
  const start = Date.now();
  module.logger.info('Refreshing Pact Slots for all Actors');
  for (const actor of game.actors) {
    if (actor.type !== 'character') {
      continue;
    }
    const hasSpellcastingClass = someSpellcastingClass(actor as dnd5e.documents.Actor5e, () => true);
    if (hasSpellcastingClass) {
      actor.prepareDerivedData();
      actor.render(false);
    }
  }
  module.logger.info('Done refreshing Pact Slots', `${(Date.now() - start) / 1000}s`);
};
registerSettingChangeHandler(refreshPactSlots);

Hooks.once('ready', () => {
  const basePrepareDerivedData = dnd5e.documents.Actor5e.prototype.prepareDerivedData;
  dnd5e.documents.Actor5e.prototype.prepareDerivedData = function () {
    basePrepareDerivedData.call(this);
    refreshActorPactSlots(this);
  };
  refreshPactSlots();
});

const refreshActorPactSlots = (actor: dnd5e.documents.Actor5e) => {
  const { name, type } = actor;
  if (type !== 'character') {
    module.logger.debug('Not refreshing Pact Slots for non-character Actor', type, name, actor.id);
    return;
  }
  module.logger.debug('Refreshing Pact Slots for Actor', name, actor.id);
  const hasCustomPactClass = someSpellcastingClass(actor, (_levels, progression) =>
    customPactTypes.some(({ key }) => key === progression),
  );
  if (hasCustomPactClass) {
    module.logger.debug('Actor has at least one custom pact class', name, actor.id);
    derivePactSlots(actor);
  } else {
    module.logger.debug('Actor has no pact classes', name, actor.id);
  }
};
