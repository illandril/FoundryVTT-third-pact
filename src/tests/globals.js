export default {
  dnd5e: {
    config: {
      spellcastingTypes: {
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
      },
    },
  },
};
