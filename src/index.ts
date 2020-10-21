type Unary<Param, Return> = (_: Param) => Return;
type NumberFunction = () => number;
type RollFunction = NumberFunction;

const r = Math.random;

const sum = (a: number, b: number): number => a + b;

const sumArray = (arr: number[]) => arr.reduce(sum, 0);

export const callMultipleTimes = (times: number) => (
  func: (index: number) => any,
): any[] => {
  let i = 0;
  const results = [];
  while (i < times) {
    i += 1;
    results[i] = func(i);
  }
  return results;
};

const callAndAdd = (modifier: number) => (
  func: NumberFunction,
): NumberFunction => () => func() + modifier;

export const randomNumberBetween = (high: number, low = 0): number =>
  r() * (high - low) + low;

export const randomIntegerBetween = (high: number, low = 0): number =>
  Math.round(randomNumberBetween(high, low));

// Unary version of randomIntegerBetween
export const randomInteger: Unary<number, number> = randomIntegerBetween;

export const randomBoolean = (): boolean => r() > 0.5;

export const randomElement: <T>(arr: T[]) => T = (arr) =>
  arr[randomInteger(arr.length - 1)];

export const createDie: Unary<number, RollFunction> = (sides: number) => () =>
  randomIntegerBetween(sides, 1);

export const multipleDice = (die: RollFunction) => (
  multiplier: number,
): RollFunction => () => sumArray(callMultipleTimes(multiplier)(die));

export const addToRoll = callAndAdd;
