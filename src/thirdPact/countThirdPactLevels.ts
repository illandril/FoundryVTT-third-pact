import { FULL_PACT_TYPE, THIRD_PACT_TYPE } from './pactTypes';
import someSpellcastingClass from './someSpellcastingClass';

const countThirdPactLevels = (actor: dnd5e.documents.Actor5e, roundingMode: RoundingMode) => {
  let fullLevels = 0;
  let thirdLevels = 0;
  let classes = 0;

  someSpellcastingClass(actor, (levels, progression) => {
    if (progression === FULL_PACT_TYPE) {
      classes++;
      fullLevels += levels;
    } else if (progression === THIRD_PACT_TYPE) {
      classes++;
      thirdLevels += levels;
    }
    return false;
  });

  if (thirdLevels === 0) {
    // The actor doesn't have any third-caster pact classes
    // Actor5e already handled full-pact slot calculation
    return 0;
  }
  const isMultiClass = classes > 1;

  const levels = fullLevels + roundThirdLevels(isMultiClass, thirdLevels, roundingMode);
  return Math.clamped(levels, 0, dnd5e.config.maxLevel);
};

export default countThirdPactLevels;

const roundThirdLevels = (isMultiClass: boolean, levels: number, mode: RoundingMode) => {
  let roundDown;
  switch (mode) {
    case 'down':
      roundDown = true;
      break;
    case 'up':
      roundDown = false;
      break;
    default:
      roundDown = isMultiClass;
  }

  if (roundDown) {
    return Math.floor(levels / 3);
  }
  return Math.ceil(levels / 3);
};

