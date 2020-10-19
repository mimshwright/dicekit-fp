const r = Math.random;

export const randomNumberBetween = (high: number, low = 0): number =>
  r() * (high - low) + low;

export const randomIntegerBetween = (high: number, low = 0): number =>
  Math.round(randomNumberBetween(high, low));
