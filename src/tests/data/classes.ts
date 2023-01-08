import { mockItem } from '../mockHelpers';

export const nonCaster = (levels?: number) => {
  return mockItem({
    id: 'sY1RPEeH8wDLksZv',
    name: 'Fighter',
    type: 'class',
    system: {
      levels,
    },
  });
};

export const fullCaster = (levels?: number) => {
  return mockItem({
    id: 'iRcFINsL9GQAJhTL',
    name: 'Wizard',
    type: 'class',
    system: {
      levels,
      spellcasting: {
        progression: 'full',
      },
    },
  });
};

export const halfCaster = (levels?: number) => {
  return mockItem({
    id: 'NhHh0xH7W6acteQl',
    name: 'Ranger',
    type: 'class',
    system: {
      levels,
      spellcasting: {
        progression: 'half',
      },
    },
  });
};

export const fullPact = (levels?: number) => {
  return mockItem({
    id: '4IdieaTxb7i1Xyvf',
    name: 'Warlock',
    type: 'class',
    system: {
      levels,
      spellcasting: {
        progression: 'pact',
      },
    },
  });
};

export const thirdPact = (levels?: number) => {
  return mockItem({
    id: 'UugzTeSk0oDIfARk',
    name: 'Third Pact Class',
    type: 'class',
    system: {
      levels,
      spellcasting: {
        progression: 'illandril_thirdpact',
      },
    },
  });
};

export const customPactA = (levels?: number) => {
  return mockItem({
    id: 'DGMUHZEGSmq6MHJI',
    name: 'Custom Pact A Class',
    type: 'class',
    system: {
      levels,
      spellcasting: {
        progression: 'illandril_custompact_a',
      },
    },
  });
};

export const customPactB = (levels?: number) => {
  return mockItem({
    id: 'ucEWDsKa3cMnxWIo',
    name: 'Custom Pact B Class',
    type: 'class',
    system: {
      levels,
      spellcasting: {
        progression: 'illandril_custompact_b',
      },
    },
  });
};

export const customPactC = (levels?: number) => {
  return mockItem({
    id: 'OOmRoB6Nda3FvxzX',
    name: 'Custom Pact C Class',
    type: 'class',
    system: {
      levels,
      spellcasting: {
        progression: 'illandril_custompact_c',
      },
    },
  });
};
