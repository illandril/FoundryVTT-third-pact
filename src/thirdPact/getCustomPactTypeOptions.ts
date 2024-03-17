import module from '../module';
import { CustomPactType } from './settings';

type CustomPactLevel = {
  classLevel: number
  slots: number
  spellLevel: number
};
type CustomPactProgression = CustomPactLevel[];

type ParsedJSON = object | unknown[] | string | number | boolean | null;
type MaybeCustomPactOptions = {
  slots?: unknown
  spellLevel?: unknown
} | Exclude<ParsedJSON, object>;

const getCustomPactTypeOptions = (customPactType: CustomPactType): CustomPactProgression => {
  let parsed: ParsedJSON | undefined;
  const value = customPactType.setting.get();
  if (value) {
    try {
      parsed = JSON.parse(value) as ParsedJSON;
    } catch (error) {
      module.logger.error('Error parsing custom Pact options', customPactType.key, value, error);
    }
  }
  if (!Array.isArray(parsed)) {
    parsed = [];
  }
  const maybeOptions = parsed as MaybeCustomPactOptions[];

  let slots = 0;
  let spellLevel = 1;
  const options: CustomPactProgression = [];
  for (let level = 0; level < dnd5e.config.maxLevel; level++) {
    if (maybeOptions.length > level) {
      const maybeLevel = maybeOptions[level];
      if (maybeLevel && typeof maybeLevel === 'object') {
        if (typeof maybeLevel.slots === 'number') {
          slots = maybeLevel.slots;
        }
        if (typeof maybeLevel.spellLevel === 'number') {
          spellLevel = maybeLevel.spellLevel;
        }
      }
    }
    options.push({
      classLevel: level + 1,
      slots,
      spellLevel,
    });
  }

  return options;
};

export default getCustomPactTypeOptions;
