import module from '../module';
import { registerSettingChangeHandler } from './settings';
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
      actor.prepareData();
      actor.render(false);
    }
  }
  module.logger.info('Done refreshing Pact Slots', `${(Date.now() - start) / 1000}s`);
};
registerSettingChangeHandler(refreshPactSlots);
