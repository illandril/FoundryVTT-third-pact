import module from '../../module';
import getCustomPactTypeOptions from '../getCustomPactTypeOptions';
import { customPactTypes } from '../settings';
import CSS from './styles';

module.registerTemplate('menu-customPacts-pact.html');

const getNumeric = (formData: Record<string, unknown>, key: string, fallback: number) => {
  let value = formData[key];
  if (typeof value === 'string') {
    value = Number.parseInt(value, 10);
  }
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return value;
  }
  return fallback;
};

const menuLocalize = (key: string) => module.localize(`setting.menu.customPacts.${key}`);

class CustomPactsForm extends FormApplication {
  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions(): FormApplicationOptions {
    return {
      ...FormApplication.defaultOptions,
      ...customPactsFormOptions,
      classes: ['sheet'],
      // width: 960,
      closeOnSubmit: true,
      tabs: [{ navSelector: '.tabs', contentSelector: 'nav + section', group: 'primary', initial: 'pact1' }],
    };
  }

  getData() {
    const spellLevelsMinusCantrip: Omit<typeof dnd5e.config.spellLevels, 0> & { 0?: string } = {
      ...dnd5e.config.spellLevels,
    };
    // biome-ignore lint/performance/noDelete: While delete is slower to execute, we care about the distinction between undefined and not defined here and it's easier to delete than add everything but
    delete spellLevelsMinusCantrip[0];

    return {
      CSS,
      menuLocalize,
      spellLevels: spellLevelsMinusCantrip,
      customPacts: customPactTypes.map((customPactType) => ({
        key: customPactType.key,
        label: module.localize(`setting.${customPactType.key}.label`),
        progression: getCustomPactTypeOptions(customPactType),
      })),
    };
  }

  // biome-ignore lint/suspicious/useAwait: FormApplication relies on this being async
  async _updateObject(_event: unknown, formData: Record<string, unknown>) {
    for (const customPactType of customPactTypes) {
      const data: {
        slots: number;
        spellLevel: number;
      }[] = [];
      let lastSlots = 0;
      let lastSpellLevel = 1;
      for (let level = 0; level < dnd5e.config.maxLevel; level++) {
        const slots = getNumeric(formData, `${customPactType.key}.${level + 1}.slots`, lastSlots);
        lastSlots = slots;
        const spellLevel = getNumeric(formData, `${customPactType.key}.${level + 1}.spellLevel`, lastSpellLevel);
        lastSpellLevel = spellLevel;
        data.push({
          slots,
          spellLevel,
        });
      }
      customPactType.setting.set(JSON.stringify(data));
    }
  }
}

const customPactsFormOptions = module.settings.registerMenu('customPacts', {
  icon: 'fas fa-bars',
  type: CustomPactsForm,
  restricted: true,
});
