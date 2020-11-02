import { NumberGenerator, Modifier } from "./types";

// identity :: a -> () -> a
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
export const identity = <T>(a: T) => (_ignored?: any) => a;

// add :: Number a => (a,a) -> a
export const add = (a: number, b: number): number => a + b;

// sum :: Number a => (...a[]) -> a
export const sum = (...numbers: number[]): number => numbers.reduce(add, 0);
// sumArray :: Number a => a[] -> a
export const sumArray = (numbers: number[]): number => sum(...numbers);

// max :: Number a => a[] -> a
export const max = (nums: number[]): number =>
  nums.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);

// min :: Number a => a[] -> a
export const min = (nums: number[]): number =>
  nums.reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);

// callMultipleTimes :: Number t => t -> (t -> a) -> a[]
export const callMultipleTimes = (times: number) => (
  func: (index: number) => any,
): any[] => {
  let i = 0;
  const results = [];
  while (i < times) {
    results[i] = func(i);
    i += 1;
  }
  return results;
};

// callAndAdd :: Number a => a -> (() -> a) -> (() -> a)
export const callAndAdd = (modifier: Modifier) => (
  func: NumberGenerator,
): NumberGenerator => () => func() + modifier;
