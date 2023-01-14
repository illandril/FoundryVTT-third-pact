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
    spellcasting: {
      progression: 'full',
    },
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
    spellcasting: {
      progression: 'half',
    },
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
    spellcasting: {
      progression: 'pact',
    },
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
    spellcasting: {
      progression: 'illandril_thirdpact',
    },
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
    spellcasting: {
      progression: 'illandril_custompact_a',
    },
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
    spellcasting: {
      progression: 'illandril_custompact_b',
    },
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
    spellcasting: {
      progression: 'illandril_custompact_c',
    },
    system: {
      levels,
      spellcasting: {
        progression: 'illandril_custompact_c',
      },
    },
  });
};
