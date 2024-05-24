import './addSpellProgressions';

it('adds third pact types on init', () => {
  expect(dnd5e.config.spellProgression.illandril_thirdpact).not.toBeDefined();
  expect(dnd5e.config.spellProgression.illandril_custompact_a).not.toBeDefined();
  expect(dnd5e.config.spellProgression.illandril_custompact_b).not.toBeDefined();
  expect(dnd5e.config.spellProgression.illandril_custompact_c).not.toBeDefined();

  const initialProgressions = Object.keys(dnd5e.config.spellProgression).length;

  Hooks.callAll('init');

  const updatedProgressions = Object.keys(dnd5e.config.spellProgression).length;

  expect(dnd5e.config.spellProgression.illandril_thirdpact).toBe('mock-localize[illandril-third-pact.thirdpact]');
  expect(dnd5e.config.spellProgression.illandril_custompact_a).toBe(
    'mock-localize[illandril-third-pact.setting.illandril_custompact_a.label]',
  );
  expect(dnd5e.config.spellProgression.illandril_custompact_b).toBe(
    'mock-localize[illandril-third-pact.setting.illandril_custompact_b.label]',
  );
  expect(dnd5e.config.spellProgression.illandril_custompact_c).toBe(
    'mock-localize[illandril-third-pact.setting.illandril_custompact_c.label]',
  );

  expect(updatedProgressions).toBe(initialProgressions + 4);
});
