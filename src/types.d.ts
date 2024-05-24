declare global {
  type RoundingMode = 'standard' | 'down' | 'up';
  type Spells = NonNullable<dnd5e.documents.ActorSystemData.Character['spells']>;

  namespace dnd5e {
    namespace config {
      // biome-ignore lint/style/useNamingConvention: dnd5e's name, not ours
      interface spellProgression {
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_thirdpact: string;
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_custompact_a: string;
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_custompact_b: string;
        // biome-ignore lint/style/useNamingConvention: Historical name... would be nice to change to camelCase, but probably not worth the time to migrate
        illandril_custompact_c: string;
      }
    }
  }
}

export type {};
