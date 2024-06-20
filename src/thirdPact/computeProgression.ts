import roundLevels from '../utils/roundLevels';
import { customPactTypes, leveledRoundingMode, pactRoundingMode } from './settings';

type ComputeSpellcastingProgressionCallback = (
  progression: { slot: number; pact: number },
  actor: dnd5e.documents.Actor5e,
  cls: dnd5e.documents.Item5e,
  spellcasting: dnd5e.documents.ItemSystemData.SpellcastingDescription,
  count: number,
) => boolean;
declare global {
  interface HookCallbacks {
    'dnd5e.computePactProgression': ComputeSpellcastingProgressionCallback;
    'dnd5e.computeLeveledProgression': ComputeSpellcastingProgressionCallback;
  }
}

const calculateProgression = (
  spellcasting: dnd5e.documents.ItemSystemData.SpellcastingDescription,
  count: number,
  prog: {
    label: string;
    divisor: number;
    roundUp?: boolean;
  },
  roundingMode: RoundingMode,
) => {
  const unroundedLevels = (spellcasting.levels ?? 0) / (prog.divisor ?? 1);
  return roundLevels(count > 1, unroundedLevels, roundingMode);
};

Hooks.on('dnd5e.computePactProgression', (progression, _actor, _cls, spellcasting, count) => {
  if (!spellcasting.progression) {
    return false;
  }
  if (customPactTypes.some((type) => type.key === spellcasting.progression)) {
    return false;
  }
  const prog = dnd5e.config.spellcastingTypes.pact.progression?.[spellcasting.progression];
  if (!prog) {
    return true;
  }

  progression.pact += calculateProgression(spellcasting, count, prog, pactRoundingMode.get());

  return false;
});

Hooks.on('dnd5e.computeLeveledProgression', (progression, _actor, _cls, spellcasting, count) => {
  if (!spellcasting.progression) {
    return false;
  }
  const roundingMode = leveledRoundingMode.get();
  if (roundingMode === 'system') {
    return true;
  }
  const prog = dnd5e.config.spellcastingTypes.leveled.progression?.[spellcasting.progression];
  if (!prog) {
    return true;
  }

  progression.slot += calculateProgression(spellcasting, count, prog, roundingMode);

  return false;
});
