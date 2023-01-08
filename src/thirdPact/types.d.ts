declare global {
  type RoundingMode = 'standard' | 'down' | 'up';
  type Spells = NonNullable<dnd5e.documents.ActorSystemData.Character['spells']>;

  namespace ClientSettings {
    interface Values {
      'illandril-third-pact.roundingMode': RoundingMode
      'illandril-third-pact.illandril_custompact_a': string
      'illandril-third-pact.illandril_custompact_b': string
      'illandril-third-pact.illandril_custompact_c': string
    }
  }
}

export {};
