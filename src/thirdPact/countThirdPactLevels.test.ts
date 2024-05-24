import * as classes from '../tests/data/classes';
import { mockActor } from '../tests/mockHelpers';
import countThirdPactLevels from './countThirdPactLevels';

describe.each(['standard', 'down', 'up'] as const)('roundingMode: %s', (roundingMode) => {
  it('returns 0 for a non-caster', () => {
    const actor = mockActor([classes.nonCaster(5)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(0);
  });

  it('returns 0 for a full caster', () => {
    const actor = mockActor([classes.fullCaster(5)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(0);
  });

  it('returns 0 for a full pact caster', () => {
    const actor = mockActor([classes.fullPact(5)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(0);
  });

  it('returns 0 for a full pact multi-class actor', () => {
    const actor = mockActor([classes.fullPact(5), classes.fullPact(5)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(0);
  });

  it.each([
    [0, 0],
    [3, 1],
    [6, 2],
    [9, 3],
    [12, 4],
    [15, 5],
    [18, 6],
  ])('levels=%i returns %i for a third pact caster', (levels, expectedResult) => {
    const actor = mockActor([classes.thirdPact(levels)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(expectedResult);
  });

  it.each([
    [1, 2, 1],
    [2, 1, 1],
    [1, 5, 2],
    [3, 3, 2],
    [5, 1, 2],
    [1, 8, 3],
    [4, 5, 3],
    [5, 4, 3],
    [8, 1, 3],
    [1, 11, 4],
    [6, 6, 4],
    [11, 1, 4],
    [1, 14, 5],
    [7, 8, 5],
    [8, 7, 5],
    [14, 1, 5],
    [1, 17, 6],
    [9, 9, 6],
    [17, 1, 6],
  ])('levels a=%i, b=%i returns %i for a multi-class third pact caster', (level1, level2, expectedResult) => {
    const actor = mockActor([classes.thirdPact(level1), classes.thirdPact(level2)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(expectedResult);
  });

  it.each([
    [3, 1, 2],
    [3, 5, 6],
    [3, 10, 11],
    [3, 17, 18],
    [6, 1, 3],
    [6, 14, 16],
    [9, 1, 4],
    [9, 11, 14],
    [12, 1, 5],
    [12, 8, 12],
    [15, 1, 6],
    [15, 5, 10],
    [18, 1, 7],
    [18, 2, 8],

    // Overflow limits at 20
    [3, 20, 20],
    [6, 19, 20],
    [9, 18, 20],
    [20, 20, 20],
  ])(
    'levels third=%i, full=%i returns %i for a multi-class third+full pact caster',
    (level1, level2, expectedResult) => {
      const actor = mockActor([classes.thirdPact(level1), classes.fullPact(level2)]);

      const result = countThirdPactLevels(actor, roundingMode);

      expect(result).toBe(expectedResult);
    },
  );

  it('treats undefined levels as 0', () => {
    const actor = mockActor([classes.thirdPact(undefined), classes.fullPact(undefined), classes.thirdPact(3)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(1);
  });
});

describe.each(['down', 'standard'] as const)('roundingMode: %s', (roundingMode) => {
  it.each([
    // 2
    [1, 1, 0],
    // 4/5
    [1, 3, 1],
    [2, 2, 1],
    [1, 4, 1],
    [2, 3, 1],
    [3, 2, 1],
    // 7/8
    [1, 6, 2],
    [2, 5, 2],
    [4, 3, 2],
    [3, 4, 2],
    [1, 7, 2],
    [2, 6, 2],
    [3, 5, 2],
    [4, 4, 2],
    // 10/11
    [1, 9, 3],
    [5, 5, 3],
    [1, 10, 3],
    [5, 6, 3],
    // 13/14
    [1, 12, 4],
    [6, 7, 4],
    [1, 13, 4],
    [7, 7, 4],
    // 16/17
    [1, 15, 5],
    [8, 8, 5],
    [1, 16, 5],
    [8, 9, 5],
    // 19/20
    [1, 18, 6],
    [9, 10, 6],
    [18, 1, 6],
    [1, 19, 6],
    [10, 10, 6],
    [19, 1, 6],
  ])('levels a=%i, b=%i returns %i for a multi-class third pact caster', (level1, level2, expectedResult) => {
    const actor = mockActor([classes.thirdPact(level1), classes.thirdPact(level2)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(expectedResult);
  });
});

describe.each(['up', 'standard'] as const)('roundingMode: %s', (roundingMode) => {
  it.each([
    [1, 1],
    [2, 1],
    [4, 2],
    [5, 2],
    [7, 3],
    [8, 3],
    [10, 4],
    [11, 4],
    [13, 5],
    [14, 5],
    [16, 6],
    [17, 6],
    [19, 7],
    [20, 7],
  ])('levels=%i returns %i for a third pact caster', (levels, expectedResult) => {
    const actor = mockActor([classes.thirdPact(levels)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(expectedResult);
  });
});

describe('roundingMode: down', () => {
  const roundingMode = 'down';

  it.each([
    [1, 0],
    [2, 0],
    [4, 1],
    [5, 1],
    [7, 2],
    [8, 2],
    [10, 3],
    [11, 3],
    [13, 4],
    [14, 4],
    [16, 5],
    [17, 5],
    [19, 6],
    [20, 6],
  ])('levels=%i returns %i for a third pact caster', (levels, expectedResult) => {
    const actor = mockActor([classes.thirdPact(levels)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(expectedResult);
  });
});

describe('roundingMode: up', () => {
  const roundingMode = 'up';

  it.each([
    // 2
    [1, 1, 1],
    // 4/5
    [1, 3, 2],
    [2, 2, 2],
    [1, 4, 2],
    [2, 3, 2],
    [3, 2, 2],
    // 7/8
    [1, 6, 3],
    [2, 5, 3],
    [4, 3, 3],
    [3, 4, 3],
    [1, 7, 3],
    [2, 6, 3],
    [3, 5, 3],
    [4, 4, 3],
    // 10/11
    [1, 9, 4],
    [5, 5, 4],
    [1, 10, 4],
    [5, 6, 4],
    // 13/14
    [1, 12, 5],
    [6, 7, 5],
    [1, 13, 5],
    [7, 7, 5],
    // 16/17
    [1, 15, 6],
    [8, 8, 6],
    [1, 16, 6],
    [8, 9, 6],
    // 19/20
    [1, 18, 7],
    [9, 10, 7],
    [18, 1, 7],
    [1, 19, 7],
    [10, 10, 7],
    [19, 1, 7],
  ])('levels a=%i, b=%i returns %i for a multi-class third pact caster', (level1, level2, expectedResult) => {
    const actor = mockActor([classes.thirdPact(level1), classes.thirdPact(level2)]);

    const result = countThirdPactLevels(actor, roundingMode);

    expect(result).toBe(expectedResult);
  });
});
