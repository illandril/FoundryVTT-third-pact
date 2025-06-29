import module from '../module';
import calculateCustomPactSlots from './calculateCustomPactSlots';
import { customPactTypes } from './settings';
import someSpellcastingClass from './someSpellcastingClass';

Hooks.on('dnd5e.preparePactSlots', (spells, actor) => {
  const hadCustomPactClass =
    spells &&
    someSpellcastingClass(actor, (levels, progression) => {
      const customPactType = customPactTypes.find(({ key }) => key === progression);
      if (customPactType) {
        module.logger.debug('Actor has a custom pact slot class', name, actor.id);
        calculateCustomPactSlots(spells, levels, customPactType);
        return true;
      }
      return false;
    });

  return !hadCustomPactClass;
});
