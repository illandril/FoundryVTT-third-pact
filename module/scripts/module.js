export const KEY = 'illandril-third-pact';
export const NAME = "Illandril's Third Pact Slot";
export const CSS_PREFIX = `${KEY}--`;

const LOG_PREFIX = `%c${NAME}`
const _log = (logFN, ...args) => {
  logFN.apply(console, [LOG_PREFIX, 'background-color: #4f0104; color: #fff; padding: 0.1em 0.5em;', ...args]);
};

const SETTING_DEBUG = 'debug';
let debugEnabled = false;
const updateDebug = () => {
  debugEnabled = !!game.settings.get(KEY, SETTING_DEBUG);
};

Hooks.once('init', () => {
  game.settings.register(KEY, SETTING_DEBUG, {
    name: game.i18n.localize(`${KEY}.debug`),
    hint: game.i18n.localize(`${KEY}.debugHint`),
    scope: 'client',
    config: true,
    default: false,
    type: Boolean,
    onChange: updateDebug,
  });
  updateDebug();
});

export const log = {
  dir: (label, ...args) => {
    const group = `${NAME} | ${label}`;
    console.group(group);
    console.dir(...args);
    console.groupEnd(group);
  },
  debug: (...args) => {
    debugEnabled && _log(console.debug, ...args);
  },
  info: (...args) => {
    _log(console.info, ...args);
  },
  error: (...args) => {
    _log(console.error, ...args);
  },
};
