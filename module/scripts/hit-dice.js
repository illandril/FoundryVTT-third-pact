import { KEY as MODULE_NAME } from './module.js';

const SETTING_HIT_DICE_D4 = 'hitDice-d4';
const SETTING_HIT_DICE_D20 = 'hitDice-d20';

Hooks.once('init', () => {
  game.settings.register(MODULE_NAME, SETTING_HIT_DICE_D4, {
    name: game.i18n.localize('illandril-third-pact.hitDice.name.d4'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: refreshHitDice,
  });

  game.settings.register(MODULE_NAME, SETTING_HIT_DICE_D20, {
    name: game.i18n.localize('illandril-third-pact.hitDice.name.d20'),
    scope: 'world',
    config: true,
    default: false,
    type: Boolean,
    onChange: refreshHitDice,
  });

  refreshHitDice();
});

const refreshHitDice = () => {
  if (!CONFIG || !CONFIG.DND5E || !Array.isArray(CONFIG.DND5E.hitDieTypes)) {
    console.error("Can't update hit dice - CONFIG.DND5E.hitDieTypes wasn't an array as expected");
    return;
  }
  addRemoveHitDice(SETTING_HIT_DICE_D4, 'd4', true);
  addRemoveHitDice(SETTING_HIT_DICE_D20, 'd20', false);
};

const addRemoveHitDice = (setting, dX, before) => {
  const dIndex = CONFIG.DND5E.hitDieTypes.indexOf(dX);
  if (game.settings.get(MODULE_NAME, setting)) {
    if (dIndex === -1) {
      if (before) {
        CONFIG.DND5E.hitDieTypes.unshift(dX);
      } else {
        CONFIG.DND5E.hitDieTypes.push(dX);
      }
    }
  } else {
    if (dIndex !== -1) {
      CONFIG.DND5E.hitDieTypes.slice(dIndex);
    }
  }
};
