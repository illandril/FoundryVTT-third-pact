beforeEach(async () => {
  await import('./index');
  jest.resetModules();
});

afterEach(() => {
  (dnd5e.config as Record<string, unknown>).hitDieTypes = ['d4', 'd6', 'd8', 'd10', 'd12'];
});

describe('hit-dice', () => {
  it('adds d20 during startup if enabled', () => {
    SIMULATE.mockSavedSetting('illandril-third-pact', 'hitDice-d20', true);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    Hooks.callAll('init');

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);
  });

  it('does not add d20 during startup if disabled', () => {
    SIMULATE.mockSavedSetting('illandril-third-pact', 'hitDice-d20', false);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    Hooks.callAll('init');

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);
  });

  it('does not add d20 during startup if no saved setting', () => {
    SIMULATE.mockSavedSetting('illandril-third-pact', 'hitDice-d20', undefined);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    Hooks.callAll('init');

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);
  });

  it('adds d20 when enabling setting', () => {
    Hooks.callAll('init');

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    game.settings.set('illandril-third-pact', 'hitDice-d20', true);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);
  });

  it('removes d20 when disabling setting', () => {
    Hooks.callAll('init');

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    game.settings.set('illandril-third-pact', 'hitDice-d20', true);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);

    game.settings.set('illandril-third-pact', 'hitDice-d20', false);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);
  });

  it('gracefully hadles disabling setting when already disabled', () => {
    Hooks.callAll('init');

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    game.settings.set('illandril-third-pact', 'hitDice-d20', false);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    game.settings.set('illandril-third-pact', 'hitDice-d20', false);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);
  });

  it('gracefully hadles enabling setting when already enabled', () => {
    Hooks.callAll('init');

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12']);

    game.settings.set('illandril-third-pact', 'hitDice-d20', true);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);

    game.settings.set('illandril-third-pact', 'hitDice-d20', true);

    expect(dnd5e.config.hitDieTypes).toEqual(['d4', 'd6', 'd8', 'd10', 'd12', 'd20']);
  });

  it.each([undefined, null, {}])('logs an error if hitDieTypes is not an array (%j)', (value) => {
    (dnd5e.config as Record<string, unknown>).hitDieTypes = value;
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

    Hooks.callAll('init');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringMatching(/Illandril's Character Class Enhancements/),
      expect.stringMatching(/background/),
      'Cannot update hit dice - dnd5e.config.hitDieTypes was an unexpected type',
    );
  });
});
