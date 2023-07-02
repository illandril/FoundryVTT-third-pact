import module from '../module';

type SettingListener = () => void;

const listeners: SettingListener[] = [];
export const registerSettingChangeHandler = (listener: SettingListener) => {
  listeners.push(listener);
};

const onChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const customPactTypeIDs = ['a', 'b', 'c'] as const;
type CustomPactTypeID = typeof customPactTypeIDs[number];

export type CustomPactType = {
  key: `illandril_custompact_${CustomPactTypeID}`
  setting: ReturnType<typeof module.settings.register<string>>
};

const setupCustomPactType = (type: CustomPactTypeID): CustomPactType => {
  const key = `illandril_custompact_${type}` as const;
  return {
    key,
    setting: module.settings.register(key, String, '', {
      hasHint: true,
      onChange,
    }),
  };
};

export const customPactTypes = [
  setupCustomPactType('a'),
  setupCustomPactType('b'),
  setupCustomPactType('c'),
] as const;

export const roundingMode = module.settings.register('roundingMode', String, 'standard', {
  hasHint: true,
  choices: ['standard', 'down', 'up'],
  onChange,
});
