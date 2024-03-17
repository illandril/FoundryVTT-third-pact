import module from '../../module';
import getCustomPactTypeOptions from '../getCustomPactTypeOptions';
import { customPactTypes } from '../settings';
import CSS from './styles';

module.registerTemplate('menu-customPacts-pact.html');

const getNumeric = (formData: Record<string, unknown>, key: string, fallback: number) => {
  let value = formData[key];
  if (typeof value === 'string') {
    value = parseInt(value, 10);
  }
  if (typeof value === 'number' && !isNaN(value)) {
    return value;
  }
  return fallback;
};

const menuLocalize = (key: string) => module.localize(`setting.menu.customPacts.${key}`);

class CustomPactsForm extends FormApplication {
  constructor(object?: never, options?: FormApplicationOptions) {
    super(object, options);
  }

  /**
   * Default Options for this FormApplication
   */
  static get defaultOptions(): FormApplicationOptions {
    return {
      ...super.defaultOptions,
      ...customPactsFormOptions,
      classes: ['sheet'],
      // width: 960,
      closeOnSubmit: true,
      tabs: [
        { navSelector: '.tabs', contentSelector: 'nav + section', group: 'primary', initial: 'pact1' },
      ],
    };
  }

  getData() {
    const spellLevelsMinusCantrip: Omit<typeof dnd5e.config.spellLevels, 0> & { 0?: string } = {
      ...dnd5e.config.spellLevels,
    };
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

  // eslint-disable-next-line @typescript-eslint/require-await
  async _updateObject(_event: unknown, formData: Record<string, unknown>) {
    for (const customPactType of customPactTypes) {
      const data = [];
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
