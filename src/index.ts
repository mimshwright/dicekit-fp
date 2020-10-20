type Unary<Param, Return> = (_: Param) => Return;

const r = Math.random;

export const randomNumberBetween = (high: number, low = 0): number =>
  r() * (high - low) + low;

export const randomIntegerBetween = (high: number, low = 0): number =>
  Math.round(randomNumberBetween(high, low));

// Unary version of randomIntegerBetween
export const randomInteger: Unary<number, number> = randomIntegerBetween;

export const randomBoolean = (): boolean => r() > 0.5;

export const randomElement: <T>(arr: T[]) => T = (arr) =>
  arr[randomInteger(arr.length - 1)];

export const createDie: Unary<number, () => number> = (sides: number) => () =>
  randomIntegerBetween(sides, 1);
