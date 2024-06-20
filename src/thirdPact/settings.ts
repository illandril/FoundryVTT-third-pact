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
type CustomPactTypeID = (typeof customPactTypeIDs)[number];

export type CustomPactType = {
  key: `illandril_custompact_${CustomPactTypeID}`;
  setting: ReturnType<typeof module.settings.register<string>>;
};

const setupCustomPactType = (type: CustomPactTypeID): CustomPactType => {
  const key = `illandril_custompact_${type}` as const;
  return {
    key,
    setting: module.settings.register(key, String, '', {
      onChange,
      config: false,
    }),
  };
};

export const customPactTypes = [setupCustomPactType('a'), setupCustomPactType('b'), setupCustomPactType('c')] as const;

const ROUNDING_MODES: RoundingMode[] = ['standard', 'down', 'downMin1', 'up'];
const isRoundingMode = (value: string): value is RoundingMode => {
  return ROUNDING_MODES.includes(value as RoundingMode);
};
const ROUNDING_CHOICES = Object.fromEntries(
  ROUNDING_MODES.map((value) => [value, `${module.id}.setting.rounding.choice.${value}`] as const),
) as Record<RoundingMode, string>;

export const pactRoundingMode = module.settings.register<RoundingMode>('pactRoundingMode', String, 'standard', {
  hasHint: true,
  choices: ROUNDING_CHOICES,
  onChange,
});

export const leveledRoundingMode = module.settings.register<RoundingMode | 'system'>(
  'leveledRoundingMode',
  String,
  'system',
  {
    hasHint: true,
    choices: {
      system: `${module.id}.setting.leveledRoundingMode.choice.system`,
      ...ROUNDING_CHOICES,
    },
    onChange,
  },
);

const legacyRoundingMode = module.settings.register('roundingMode', String, 'MIGRATED', {
  config: false,
});
Hooks.on('ready', () => {
  const legacyValue = legacyRoundingMode.get();
  if (isRoundingMode(legacyValue)) {
    pactRoundingMode.set(legacyValue);
    legacyRoundingMode.set('MIGRATED');
  }
});
