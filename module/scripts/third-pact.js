import { KEY as MODULE_NAME, log } from './module.js';

const SETTING_ROUNDING = 'roundingMode';
const SETTING_ROUNDING__STANDARD = 'standard';
const SETTING_ROUNDING__DOWN = 'down';
const SETTING_ROUNDING__UP = 'up';

const THIRD_PACT_TYPE = 'illandril_thirdpact';
const CUSTOM_PACT_TYPE_PREFIX = 'illandril_custompact_';
const CUSTOM_PACT_TYPES = [
  `${CUSTOM_PACT_TYPE_PREFIX}a`, `${CUSTOM_PACT_TYPE_PREFIX}b`, `${CUSTOM_PACT_TYPE_PREFIX}c`,
];

const getCustomPactTypeOptions = (customPactType) => {
  let options;
  const setting = game.settings.get(MODULE_NAME, customPactType);
  if(setting) {
    try {
      options = JSON.parse(setting);
    } catch (e) {
      log.error(setting);
      log.error(e);
    }
  } else {
  }
  if (!Array.isArray(options)) {
    return null;
  }
  return options;
};

Hooks.once('init', () => {
  game.settings.register(MODULE_NAME, SETTING_ROUNDING, {
    name: game.i18n.localize(`${MODULE_NAME}.roundingMode`),
    hint: game.i18n.localize(`${MODULE_NAME}.roundingModeHint`),
    scope: 'world',
    config: true,
    default: SETTING_ROUNDING__STANDARD,
    type: String,
    choices: {
      standard: game.i18n.localize(`${MODULE_NAME}.roundingMode-Standard`),
      down: game.i18n.localize(`${MODULE_NAME}.roundingMode-Down`),
      up: game.i18n.localize(`${MODULE_NAME}.roundingMode-Up`),
    },
    onChange: refreshPactSlots,
  });

  for (let customPactType of CUSTOM_PACT_TYPES) {
    game.settings.register(MODULE_NAME, customPactType, {
      name: game.i18n.localize(`${MODULE_NAME}.${customPactType}.name`),
      hint: game.i18n.localize(`${MODULE_NAME}.${customPactType}.hint`),
      scope: 'world',
      config: true,
      default: '',
      type: String,
      onChange: refreshPactSlots,
    });
  }
});

Hooks.once('ready', () => {
  CONFIG.DND5E.spellProgression[THIRD_PACT_TYPE] = `${MODULE_NAME}.thirdpact`;
  for (let customPactType of CUSTOM_PACT_TYPES) {
    CONFIG.DND5E.spellProgression[customPactType] = `${MODULE_NAME}.${customPactType}.name`;
  }

  const basePrepareDerivedData = game.dnd5e.entities.Actor5e.prototype.prepareDerivedData;
  game.dnd5e.entities.Actor5e.prototype.prepareDerivedData = function () {
    basePrepareDerivedData.call(this);
    derivePactSlots(this.data);
  };
});

const refreshPactSlots = () => {
  log.debug('Refreshing Pact Slots');
  game.actors.forEach((actor) => {
    const pactClass = someSpellcastingClass(actor, (itemData, progression) => {
      return (
        progression === 'pact' ||
        progression === THIRD_PACT_TYPE ||
        CUSTOM_PACT_TYPES.includes(progression)
      );
    });
    if (pactClass) {
      log.debug(`Actor[${actor.name}] has at least one pact class`);
      derivePactSlots(actor.data);
      actor.render(false);
    }
  });
};

const someSpellcastingClass = (actorData, fn) => {
  actorData.items.some((item) => {
    if (item.type === 'class') {
      const itemData = item.data.data;
      let progression = itemData.spellcasting;
      if (typeof progression === 'object') {
        progression = progression.progression;
      }
      if (progression) {
        return fn(itemData, progression);
      }
    }
  });
};

const derivePactSlots = (actorData) => {
  if (actorData.type !== 'character') {
    // Third-pact caster calculation is only supported for players
    log.debug(`Actor[${actorData.name}] is not a character`);
    return;
  }

  const spells = actorData.data.spells;

  const hasCustomPactClass = someSpellcastingClass(actorData, (itemData, progression) => {
    if (CUSTOM_PACT_TYPES.includes(progression)) {
      log.debug(`Actor[${actorData.name}] has a custom pact slot class`);
      calculateCustomPactSlots(spells, itemData, progression);
      return true;
    }
  });
  if (hasCustomPactClass) {
    return;
  }

  let { fullLevels, thirdLevels, isMultiClass } = countPactLevels(actorData);
  // Only fix pact slots if they have a 1/3 pact caster (Actor5e handles full-pact slots just fine)
  if (thirdLevels > 0) {
    log.debug(`Actor[${actorData.name}] has at least one third-caster pact class`);
    const pactLevels = calculateEffectiveLevels(isMultiClass, fullLevels, thirdLevels);
    if (pactLevels > 0) {
      calculatePactSlots(spells, pactLevels);
    }
  }
};

const countPactLevels = (actorData) => {
  let fullLevels = 0;
  let thirdLevels = 0;
  let classes = 0;

  someSpellcastingClass(actorData, (itemData, progression) => {
    if (progression === 'pact') {
      classes++;
      fullLevels += itemData.levels;
    } else if (progression === THIRD_PACT_TYPE) {
      classes++;
      thirdLevels += itemData.levels;
    }
  });
  return { fullLevels, thirdLevels, isMultiClass: classes > 1 };
};

const calculateEffectiveLevels = (isMultiClass, fullLevels, thirdLevels) => {
  let levels = fullLevels;
  if (thirdLevels > 0) {
    levels += roundThirdLevels(isMultiClass, thirdLevels);
  }
  return Math.clamped(levels, 0, 20);
};

const roundThirdLevels = (isMultiClass, levels) => {
  const roundingMode = game.settings.get(MODULE_NAME, SETTING_ROUNDING);
  let roundDown;
  switch (roundingMode) {
    case SETTING_ROUNDING__DOWN:
      roundDown = true;
      break;
    case SETTING_ROUNDING__UP:
      roundDown = false;
      break;
    default:
      roundDown = isMultiClass;
  }

  if (roundDown) {
    return Math.floor(levels / 3);
  } else {
    return Math.ceil(levels / 3);
  }
};

const calculatePactSlots = (spells, effectivePactLevel) => {
  spells.pact = spells.pact || {};
  spells.pact.level = Math.ceil(Math.min(10, effectivePactLevel) / 2);
  const pactOverride = parseInt(spells.pact.override, 10);
  if (!isNaN(pactOverride)) {
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
  spells.pact.value = Math.min(spells.pact.value, spells.pact.max);
};

const calculateCustomPactSlots = (spells, customPactClass, progression) => {
  const customPactOptions = getCustomPactTypeOptions(progression);
  let max = 0;
  let level = 1;
  if (customPactOptions) {
    const classLevel = customPactClass.levels;
    let levelOptions;
    if (classLevel > customPactOptions.length) {
      levelOptions = customPactOptions[customPactOptions.length - 1];
    } else if (classLevel <= 0) {
      levelOptions = null;
    } else {
      levelOptions = customPactOptions[classLevel - 1];
    }
    log.debug(`Custom pact options for level[${classLevel}]: ${JSON.stringify(levelOptions)}`)
    if (levelOptions) {
      if (levelOptions.slots) {
        max = levelOptions.slots;
      }
      if (levelOptions.spellLevel) {
        level = levelOptions.spellLevel;
      }
    }
  }
  const pactOverride = parseInt(spells.pact.override, 10);
  if (!isNaN(pactOverride)) {
    log.debug(`Actor has a pact slots override`);
    max = Math.max(pactOverride, 1);
  }
  spells.pact = spells.pact || {};
  spells.pact.level = level;
  spells.pact.max = max;
  spells.pact.value = Math.min(spells.pact.value, spells.pact.max);
};
