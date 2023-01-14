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
    spellcasting: {
      progression,
    },
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
  expect(callback).toBeCalledWith(1, progression);
});

it.each([
  'none', 'full', 'half', 'third', 'pact', 'illandril_thirdpact',
  'illandril_custompact_a', 'illandril_custompact_b', 'illandril_custompact_c',
] as const)('calls callback for non-caster class with subclass with progression %j', (progression) => {
  const classItem = mockItem({
    id: 'dM7AuThHzjEOXSlP',
    name: 'Test Class',
    type: 'class',
    spellcasting: {
      progression,
    },
    system: {
      levels: 1,
    },
  });
  const subclassItem = mockItem({
    id: 'FwzoFtC5C7IlYfvr',
    name: 'Test Subclass',
    type: 'subclass',
    spellcasting: {
      progression,
    },
    system: {
      spellcasting: {
        progression,
      },
    },
  });

  const actor = mockActor([classItem, subclassItem]);
  const callback = jest.fn();

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(false);
  expect(callback).toBeCalledTimes(1);
  expect(callback).toBeCalledWith(1, progression);
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
  const halfCaster = classes.halfCaster(2);
  const fullCaster = classes.fullCaster(3);
  const fullPact = classes.fullPact(4);
  const thirdPact = classes.thirdPact(5);

  const actor = mockActor([fighter, halfCaster, fullCaster, fullPact, thirdPact]);
  const callback = jest.fn();

  someSpellcastingClass(actor, callback);

  expect(callback).toBeCalledTimes(4);
  expect(callback).toBeCalledWith(2, 'half');
  expect(callback).toBeCalledWith(3, 'full');
  expect(callback).toBeCalledWith(4, 'pact');
  expect(callback).toBeCalledWith(5, 'illandril_thirdpact');
});

it('stops when one class returns true', () => {
  const fullCaster = classes.fullCaster(1);
  const halfCaster = classes.halfCaster(2);
  const customPact = classes.customPactA(3);

  const actor = mockActor([fullCaster, customPact, halfCaster]);
  const callback = jest.fn().mockImplementation((_levels, progression) => progression === 'illandril_custompact_a');

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(true);

  expect(callback).toBeCalledTimes(2);
  expect(callback).toHaveBeenLastCalledWith(3, 'illandril_custompact_a');
});

it('returns false if nothing returns true', () => {
  const fullCaster = classes.fullCaster(1);
  const fullPact = classes.fullPact(2);
  const thirdPact = classes.thirdPact(3);

  const actor = mockActor([fullCaster, fullPact, thirdPact]);
  const callback = jest.fn().mockImplementation(() => undefined);

  const result = someSpellcastingClass(actor, callback);

  expect(result).toBe(false);

  expect(callback).toBeCalledTimes(3);
});

