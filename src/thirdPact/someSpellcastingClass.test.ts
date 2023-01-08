import * as classes from '../tests/data/classes';
import { mockActor, mockItem } from '../tests/mockHelpers';
import someSpellcastingClass from './someSpellcastingClass';

it.each([
  'none', 'full', 'half', 'third', 'pact', 'illandril_thirdpact',
  'illandril_custompact_a', 'illandril_custompact_b', 'illandril_custompact_c',
] as const)('calls callback for caster with progression %j', (progression) => {
  const item = mockItem({
    id: 'dM7AuThHzjEOXSlP',
    name: 'Test Class',
    type: 'class',
    system: {
      levels: 1,
      spellcasting: {
        progression,
      },
    },
  });

  const actor = mockActor([item]);
  const callback = jest.fn();

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(false);
  expect(callback).toBeCalledTimes(1);
  expect(callback).toBeCalledWith(item.system, progression);
});

it('does not call callback for non-spellcasting classes', () => {
  const item = mockItem({
    id: 'dM7AuThHzjEOXSlP',
    name: 'Test Class',
    type: 'class',
    system: {
      levels: 1,
    },
  });

  const actor = mockActor([item]);
  const callback = jest.fn();

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(false);
  expect(callback).toBeCalledTimes(0);
});

it('does not call callback for non-class items', () => {
  const item = mockItem({
    id: 'dM7AuThHzjEOXSlP',
    name: 'Test Clazz',
    type: 'clazz',
    system: {
      levels: 1,
      spellcasting: {
        progression: 'pact',
      },
    },
  });

  const actor = mockActor([item]);
  const callback = jest.fn();

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(false);
  expect(callback).toBeCalledTimes(0);
});

it('gracefully handles actors without items', () => {
  const actor = mockActor([]);
  const callback = jest.fn();

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(false);
  expect(callback).toBeCalledTimes(0);
});

it('quintuple multi-class', () => {
  const fighter = classes.nonCaster(1);
  const halfCaster = classes.halfCaster(1);
  const fullCaster = classes.fullCaster(1);
  const fullPact = classes.fullPact(1);
  const thirdPact = classes.thirdPact(1);

  const actor = mockActor([fighter, halfCaster, fullCaster, fullPact, thirdPact]);
  const callback = jest.fn();

  someSpellcastingClass(actor, callback);

  expect(callback).toBeCalledTimes(4);
  expect(callback).toBeCalledWith(halfCaster.system, 'half');
  expect(callback).toBeCalledWith(fullCaster.system, 'full');
  expect(callback).toBeCalledWith(fullPact.system, 'pact');
  expect(callback).toBeCalledWith(thirdPact.system, 'illandril_thirdpact');
});

it('stops when one class returns true', () => {
  const fullCaster = classes.fullCaster(1);
  const halfCaster = classes.halfCaster(1);
  const customPact = classes.customPactA(1);

  const actor = mockActor([fullCaster, customPact, halfCaster]);
  const callback = jest.fn().mockImplementation((_class, progression) => progression === 'illandril_custompact_a');

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(true);

  expect(callback).toBeCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith(customPact.system, 'illandril_custompact_a');
});

it('returns false if nothing returns true', () => {
  const fullCaster = classes.fullCaster(1);
  const fullPact = classes.fullPact(1);
  const thirdPact = classes.thirdPact(1);

  const actor = mockActor([fullCaster, fullPact, thirdPact]);
  const callback = jest.fn().mockImplementation(() => undefined);

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(false);

  expect(callback).toBeCalledTimes(3);
});

