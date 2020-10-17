const r = Math.random;

export const randomNumberBetween = (high: number, low = 0) =>
  r() * (high - low) + low;

export const randomIntegerBetween = (high: number, low = 0) =>
  Math.round(randomNumberBetween(high, low));
