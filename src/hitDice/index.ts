import module from '../module';

module.settings.register('hitDice-d20', Boolean, false, {
  onChange: (enabled) => {
    if (!Array.isArray(dnd5e?.config?.hitDieTypes)) {
      module.logger.error('Cannot update hit dice - dnd5e.config.hitDieTypes was an unexpected type');
      return;
    }
    const dX = 'd20';
    const dIndex = dnd5e.config.hitDieTypes.indexOf(dX);
    if (enabled) {
      if (dIndex === -1) {
        module.logger.info('Enabling d20');
        dnd5e.config.hitDieTypes.push(dX);
      }
    } else if (dIndex !== -1) {
      module.logger.info('Disabling d20');
      dnd5e.config.hitDieTypes.splice(dIndex, 1);
    }
  },
  callOnChangeOnInit: true,
});
