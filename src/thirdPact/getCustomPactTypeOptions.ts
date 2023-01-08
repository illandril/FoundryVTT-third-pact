import module from '../module';
import { CustomPactType } from './settings';

type ParsedJSON = object | unknown[] | string | number | boolean | null;
type MaybeCustomPactOptions = {
  slots?: unknown
  spellLevel?: unknown
} | Exclude<ParsedJSON, object>;

const getCustomPactTypeOptions = (customPactType: CustomPactType) => {
  let options: ParsedJSON | undefined;
  const value = customPactType.setting.get();
  try {
    options = JSON.parse(value) as ParsedJSON;
  } catch (error) {
    module.logger.error('Error parsing custom Pact options', customPactType.key, value, error);
  }
  if (!Array.isArray(options)) {
    return null;
  }
  return options as MaybeCustomPactOptions[];
};

export default getCustomPactTypeOptions;
