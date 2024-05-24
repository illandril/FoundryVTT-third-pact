import module from '../module';
import derivePactSlots from './derivePactSlots';
import { FULL_PACT_TYPE, THIRD_PACT_TYPE } from './pactTypes';
import { customPactTypes, registerSettingChangeHandler } from './settings';
import someSpellcastingClass from './someSpellcastingClass';

const refreshPactSlots = () => {
  const start = Date.now();
  module.logger.info('Refreshing Pact Slots for all Actors');
  game.actors.forEach(refreshActorPactSlots as (actor: Actor) => void);
  module.logger.info('Done refreshing Pact Slots', `${(Date.now() - start) / 1000}s`);
};
registerSettingChangeHandler(refreshPactSlots);

Hooks.once('ready', () => {
  const basePrepareDerivedData = dnd5e.documents.Actor5e.prototype.prepareDerivedData;
  dnd5e.documents.Actor5e.prototype.prepareDerivedData = function () {
    basePrepareDerivedData.call(this);
    derivePactSlots(this);
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
  const pactClass = someSpellcastingClass(actor, (_levels, progression) => {
    return (
      progression === FULL_PACT_TYPE ||
      progression === THIRD_PACT_TYPE ||
      customPactTypes.some(({ key }) => key === progression)
    );
  });
  if (pactClass) {
    module.logger.debug('Actor has at least one pact class', name, actor.id);
    derivePactSlots(actor);
    actor.render(false);
  } else {
    module.logger.debug('Actor has no pact classes', name, actor.id);
  }
};
