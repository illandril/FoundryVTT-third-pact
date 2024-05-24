import { toInt } from '@illandril/foundryvtt-utils';
import module from '../module';

const calculatePactSlots = (spells: Spells, effectivePactLevel: number) => {
  spells.pact = spells.pact || {};
  spells.pact.level = Math.ceil(Math.min(10, effectivePactLevel) / 2);
  const pactOverride = toInt(spells.pact.override);
  if (!Number.isNaN(pactOverride)) {
    spells.pact.max = Math.max(pactOverride, 1);
  } else {
    spells.pact.max = 1;
    if (effectivePactLevel >= 2) {
      spells.pact.max++;
    }
    if (effectivePactLevel >= 11) {
      spells.pact.max++;
    }
    if (effectivePactLevel >= 17) {
      spells.pact.max++;
    }
  }
  spells.pact.value = Math.min(spells.pact.value ?? 0, spells.pact.max);
  module.logger.debug('Calculated pact slots for an effective pact level', effectivePactLevel, spells.pact);
};

export default calculatePactSlots;
