import { toInt } from '@illandril/foundryvtt-utils';
import module from '../module';
import getCustomPactTypeOptions from './getCustomPactTypeOptions';
import { CustomPactType } from './settings';

const calculateCustomPactSlots = (
  spells: Spells,
  classLevel: number,
  customPactType: CustomPactType,
) => {
  const customPactOptions = getCustomPactTypeOptions(customPactType);
  module.logger.debug('Custom pact options', customPactType.key, customPactOptions);
  let max = 0;
  let level = 1;
  let levelOptions;
  if (classLevel > customPactOptions.length) {
    levelOptions = customPactOptions[customPactOptions.length - 1];
  } else if (classLevel <= 0) {
    levelOptions = null;
  } else {
    levelOptions = customPactOptions[classLevel - 1];
  }
  module.logger.debug('Custom pact options for level', classLevel, levelOptions);
  if (levelOptions && typeof levelOptions === 'object') {
    max = levelOptions.slots;
    level = levelOptions.spellLevel;
  }

  spells.pact = spells.pact || {};
  const pactOverride = toInt(spells.pact.override);
  if (!isNaN(pactOverride)) {
    module.logger.debug('Actor has a pact slots override', pactOverride);
    max = Math.max(pactOverride, 0);
  }
  spells.pact.level = level;
  spells.pact.max = max;
  spells.pact.value = Math.min(spells.pact.value ?? 0, max);
  module.logger.debug('Calculated pact slots for a custom pact class', customPactType.key, spells.pact);
};

export default calculateCustomPactSlots;
