declare global {
  type RoundingMode = 'standard' | 'down' | 'downMin1' | 'up';
  type Spells = NonNullable<dnd5e.documents.ActorSystemData.Character['spells']>;
  type ProgressionConfigs = NonNullable<typeof dnd5e.config.spellcastingTypes.leveled.progression>;
  type ProgressionConfig = NonNullable<ProgressionConfigs[keyof ProgressionConfigs]>;

  namespace dnd5e {
    namespace config {
      // biome-ignore lint/style/useNamingConvention: dnd5e's name, not ours
      interface spellProgression {
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_custompact_a: string;
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_custompact_b: string;
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_custompact_c: string;

        illandrilPactQuarter: string;
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_thirdpact: string;
        illandrilPactHalf: string;
        illandrilPactTwoThirds: string;
        illandrilPactThreeQuarters: string;
        illandrilThreeQuarters: string;

        illandrilQuarter: string;
        illandrilTwoThirds: string;
        illandrilThreeQuarters: string;
      }

      namespace spellcastingTypes {
        // biome-ignore lint/style/useNamingConvention: dnd5e's name, not ours
        interface pact {
          progression?: ProgressionConfigs;
        }
      }
    }
  }
}

export type {};
