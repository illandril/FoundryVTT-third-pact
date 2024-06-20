import module from '../module';
import calculateCustomPactSlots from './calculateCustomPactSlots';
import { customPactTypes } from './settings';
import someSpellcastingClass from './someSpellcastingClass';

const derivePactSlots = (actor: dnd5e.documents.Actor5e) => {
  const { name, type } = actor;
  module.logger.debug('Deriving pact slots', type, name, actor.id);
  if (type !== 'character') {
    // Third-pact caster calculation is only supported for players
    return;
  }

  const system = actor.system as dnd5e.documents.ActorSystemData.Character;
  const spells = system.spells;
  if (!spells) {
    module.logger.info('Actor has no spells system data', name, actor.id);
    return;
  }

  someSpellcastingClass(actor, (levels, progression) => {
    const customPactType = customPactTypes.find(({ key }) => key === progression);
    if (customPactType) {
      module.logger.debug('Actor has a custom pact slot class', name, actor.id);
      calculateCustomPactSlots(spells, levels, customPactType);
      return true;
    }
    return false;
  });
};

export default derivePactSlots;
