import module from '../module';
import { THIRD_PACT_TYPE } from './pactTypes';
import { customPactTypes } from './settings';

Hooks.once('init', () => {
  dnd5e.config.spellProgression[THIRD_PACT_TYPE] = module.localize('thirdpact');
  for (const customPactType of customPactTypes) {
    dnd5e.config.spellProgression[customPactType.key] = module.localize(`setting.${customPactType.key}.label`);
  }
});
