import module from '../module';
import { customPactTypes } from './settings';

type CustomProgression = {
  key: string;
  divisor?: number;
};

const pactProgressions = [
  {
    key: 'PactQuarter',
    divisor: 4,
  },
  {
    key: '_thirdpact',
    divisor: 3,
  },
  {
    key: 'PactHalf',
    divisor: 2,
  },
  {
    key: 'PactTwoThirds',
    divisor: 3 / 2,
  },
  {
    key: 'PactThreeQuarters',
    divisor: 4 / 3,
  },
] as const satisfies CustomProgression[];

const leveledProgressions = [
  {
    key: 'Quarter',
    divisor: 4,
  },
  {
    key: 'TwoThirds',
    divisor: 3 / 2,
  },
  {
    key: 'ThreeQuarters',
    divisor: 4 / 3,
  },
] as const satisfies CustomProgression[];

Hooks.once('init', () => {
  for (const progression of leveledProgressions) {
    const label = module.localize(`progression.leveled.${progression.key}`);
    const progressionKey = `illandril${progression.key}` as const;
    dnd5e.config.spellProgression[progressionKey] = label;
    dnd5e.config.spellcastingTypes.leveled.progression[progressionKey] = {
      label,
      divisor: progression.divisor,
    };
  }

  dnd5e.config.spellcastingTypes.pact.progression = dnd5e.config.spellcastingTypes.pact.progression || {};
  for (const progression of pactProgressions) {
    const label = module.localize(`progression.pact.${progression.key}`);
    const progressionKey = `illandril${progression.key}` as const;
    dnd5e.config.spellProgression[progressionKey] = label;
    dnd5e.config.spellcastingTypes.pact.progression[progressionKey] = {
      label,
      divisor: progression.divisor,
    };
  }

  for (const customPactType of customPactTypes) {
    dnd5e.config.spellProgression[customPactType.key] = module.localize(`setting.${customPactType.key}.label`);
  }
});
