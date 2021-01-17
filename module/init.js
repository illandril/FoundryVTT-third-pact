const MODULE_NAME = 'illandril-third-pact';
const SETTING_ROUNDING = 'roundingMode';
const SETTING_ROUNDING__STANDARD = 'standard';
const SETTING_ROUNDING__DOWN = 'down';
const SETTING_ROUNDING__UP = 'up';

const THIRD_PACT_TYPE = 'illandril_thirdpact';

function refreshPactSlots() {
  game.actors.forEach((actor) => {
    const pactClass = actor.items.find((item) => {
      if (item.type === 'class') {
        const itemData = item.data.data;
        if (itemData.spellcasting === 'pact' || itemData.spellcasting === THIRD_PACT_TYPE) {
          return true;
        }
      }
    });
    if (pactClass) {
      derivePactSlots(actor.data);
      actor.render(false);
    }
  });
}

Hooks.once('init', () => {
  CONFIG.DND5E.spellProgression[THIRD_PACT_TYPE] = 'illandril-third-pact.thirdpact';

  game.settings.register(MODULE_NAME, SETTING_ROUNDING, {
    name: game.i18n.localize('illandril-third-pact.roundingMode'),
    hint: game.i18n.localize('illandril-third-pact.roundingModeHint'),
    scope: 'world',
    config: true,
    default: SETTING_ROUNDING__STANDARD,
    type: String,
    choices: {
      standard: game.i18n.localize('illandril-third-pact.roundingMode-Standard'),
      down: game.i18n.localize('illandril-third-pact.roundingMode-Down'),
      up: game.i18n.localize('illandril-third-pact.roundingMode-Up'),
    },
    onChange: refreshPactSlots,
  });

  const basePrepareDerivedData = game.dnd5e.entities.Actor5e.prototype.prepareDerivedData;
  game.dnd5e.entities.Actor5e.prototype.prepareDerivedData = function() {
    basePrepareDerivedData.call(this);
    derivePactSlots(this.data);
  };
});

function derivePactSlots(actorData) {
  if (actorData.type !== 'character') {
    // Third-pact caster calculation is only supported for players
    return;
  }

  let { fullLevels, thirdLevels, isMultiClass } = countPactLevels(actorData);
  // Only fix pact slots if they have a 1/3 pact caster (Actor5e handles full-pact slots just fine)
  if (thirdLevels > 0) {
    const pactLevels = calculateEffectiveLevels(isMultiClass, fullLevels, thirdLevels);
    if (pactLevels > 0) {
      calculatePactSlots(actorData.data.spells, pactLevels);
    }
  }
}

function countPactLevels(actorData) {
  let fullLevels = 0;
  let thirdLevels = 0;
  let classes = 0;

  actorData.items.forEach((item) => {
    if (item.type === 'class') {
      const itemData = item.data;
      if (itemData.spellcasting === 'pact') {
        classes++;
        fullLevels += itemData.levels;
      } else if (itemData.spellcasting === THIRD_PACT_TYPE) {
        classes++;
        thirdLevels += itemData.levels;
      }
    }
  });
  return { fullLevels, thirdLevels, isMultiClass: classes > 1 };
}

function calculateEffectiveLevels(isMultiClass, fullLevels, thirdLevels) {
  let levels = fullLevels;
  if (thirdLevels > 0) {
    levels += roundThirdLevels(isMultiClass, thirdLevels);
  }
  return Math.clamped(levels, 0, 20);
}

function roundThirdLevels(isMultiClass, levels) {
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
}

function calculatePactSlots(spells, effectivePactLevel) {
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
}
