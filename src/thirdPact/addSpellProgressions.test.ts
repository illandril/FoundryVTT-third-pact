import './addSpellProgressions';

it('adds custom spell progression types on init', () => {
  // Sanity check starting condition
  const rawProgressions = {
    artificer: 'Artificer',
    full: 'Full Caster',
    half: 'Half Caster',
    none: 'None',
    pact: 'Pact Magic',
    third: 'Third Caster',
  };
  const rawTypes = {
    leveled: {
      label: 'leveled-label',
      img: 'leveled-img',
      progression: {
        artificer: { label: 'Artificer', divisor: 2, roundUp: true },
        full: { label: 'Full Caster', divisor: 1 },
        half: { label: 'Half Caster', divisor: 2 },
        third: { label: 'Third Caster', divisor: 3 },
      },
    },
    pact: {
      label: 'pact-label',
      img: 'pact-img',
      shortRest: true,
    },
  };
  expect(dnd5e.config.spellProgression).toEqual(rawProgressions);
  expect(dnd5e.config.spellcastingTypes).toEqual(rawTypes);

  Hooks.callAll('init');

  expect(dnd5e.config.spellProgression).toEqual({
    ...rawProgressions,
    // biome-ignore lint/style/useNamingConvention: Legacy name
    illandril_custompact_a: 'mock-localize[illandril-third-pact.setting.illandril_custompact_a.label]',
    // biome-ignore lint/style/useNamingConvention: Legacy name
    illandril_custompact_b: 'mock-localize[illandril-third-pact.setting.illandril_custompact_b.label]',
    // biome-ignore lint/style/useNamingConvention: Legacy name
    illandril_custompact_c: 'mock-localize[illandril-third-pact.setting.illandril_custompact_c.label]',
    // biome-ignore lint/style/useNamingConvention: Legacy name
    illandril_thirdpact: 'mock-localize[illandril-third-pact.progression.pact._thirdpact]',
    illandrilPactHalf: 'mock-localize[illandril-third-pact.progression.pact.PactHalf]',
    illandrilPactQuarter: 'mock-localize[illandril-third-pact.progression.pact.PactQuarter]',
    illandrilPactThreeQuarters: 'mock-localize[illandril-third-pact.progression.pact.PactThreeQuarters]',
    illandrilPactTwoThirds: 'mock-localize[illandril-third-pact.progression.pact.PactTwoThirds]',
    illandrilQuarter: 'mock-localize[illandril-third-pact.progression.leveled.Quarter]',
    illandrilThreeQuarters: 'mock-localize[illandril-third-pact.progression.leveled.ThreeQuarters]',
    illandrilTwoThirds: 'mock-localize[illandril-third-pact.progression.leveled.TwoThirds]',
  });
  expect(dnd5e.config.spellcastingTypes).toEqual({
    leveled: {
      ...rawTypes.leveled,
      progression: {
        ...rawTypes.leveled.progression,
        illandrilQuarter: {
          divisor: 4,
          label: 'mock-localize[illandril-third-pact.progression.leveled.Quarter]',
        },
        illandrilThreeQuarters: {
          divisor: 4 / 3,
          label: 'mock-localize[illandril-third-pact.progression.leveled.ThreeQuarters]',
        },
        illandrilTwoThirds: {
          divisor: 1.5,
          label: 'mock-localize[illandril-third-pact.progression.leveled.TwoThirds]',
        },
      },
    },
    pact: {
      ...rawTypes.pact,
      progression: {
        illandrilPactHalf: {
          divisor: 2,
          label: 'mock-localize[illandril-third-pact.progression.pact.PactHalf]',
        },
        illandrilPactQuarter: {
          divisor: 4,
          label: 'mock-localize[illandril-third-pact.progression.pact.PactQuarter]',
        },
        illandrilPactThreeQuarters: {
          divisor: 4 / 3,
          label: 'mock-localize[illandril-third-pact.progression.pact.PactThreeQuarters]',
        },
        illandrilPactTwoThirds: {
          divisor: 1.5,
          label: 'mock-localize[illandril-third-pact.progression.pact.PactTwoThirds]',
        },
        // biome-ignore lint/style/useNamingConvention: Legacy name
        illandril_thirdpact: {
          divisor: 3,
          label: 'mock-localize[illandril-third-pact.progression.pact._thirdpact]',
        },
        // Note: custompact_a/b/c intentionally not included in progression
      },
    },
  });
});
