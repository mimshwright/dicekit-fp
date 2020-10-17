import { randomIntegerBetween } from '../src';

const callMultipleTimes = (times: number) => (func: () => any) =>
  new Array(times).fill(0).map(func);

const max = (nums: number[]) =>
  nums.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);

const min = (nums: number[]) =>
  nums.reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);

// Test the test utils.

describe('testUtils', () => {
  describe('callMultipleTimes()', () => {
    let x = 0;
    const testFunc = () => {
      x += 1;
    };

    callMultipleTimes(10)(testFunc);

    expect(x).toBe(10);
  });

  describe('min()', () => {
    it('Returns the minimum value in a number[].', () => {
      expect(min([9, 50, 7, 1, -13, 102])).toBe(-13);
    });
  });

  describe('max()', () => {
    it('Returns the maximum value in a number[].', () => {
      expect(max([9, 50, 7, 1, -13, 102])).toBe(102);
    });
  });
});

// Test the main library.

describe('dicekit', () => {
  describe('randomIntegerBetween()', () => {
    it('Creates random numbers in a range.', () => {
      const results = callMultipleTimes(500)(() =>
        randomIntegerBetween(50, 10)
      );

      expect(min(results)).toBe(10);
      expect(max(results)).toBe(50);
    });

    it('Low value defaults to 0.', () => {
      const results = callMultipleTimes(100)(() => randomIntegerBetween(10));

      expect(min(results)).toBe(0);
      expect(max(results)).toBe(10);
    });

    it('Negative numbers work.', () => {
      const results = callMultipleTimes(500)(() =>
        randomIntegerBetween(-10, -50)
      );

      expect(min(results)).toBe(-50);
      expect(max(results)).toBe(-10);
    });
  });
});
