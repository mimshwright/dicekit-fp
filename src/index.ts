type Unary<Param, Return> = (_: Param) => Return;
type NumberGenerator = () => number;
type RollFunction = NumberGenerator;

export const constant = (a: number): RollFunction => () => a;

const sum = (a: number, b: number) => a + b;

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
  func: NumberGenerator,
): NumberGenerator => () => func() + modifier;

const r = Math.random;

export const random = r;

export const randomNumberBetween = (high: number, low = 0): number =>
  r() * (high - low) + low;

export const randomIntegerBetween = (high: number, low = 0): number =>
  Math.round(randomNumberBetween(high, low));

// Unary version of randomIntegerBetween
export const randomInteger: Unary<number, number> = randomIntegerBetween;

export const randomBoolean = (): boolean => r() > 0.5;

export const randomElement: <T>(arr: T[]) => T = (arr) =>
  arr[randomInteger(arr.length - 1)];

export const multipleDice = (die: RollFunction) => (
  multiplier: number,
): RollFunction => () => sumArray(callMultipleTimes(multiplier)(die));

export const addToRoll = callAndAdd;

export const createDie: Unary<number, RollFunction> = (sides: number) => () =>
  randomIntegerBetween(sides, 1);

export const createDice = (
  sides: number,
  multiplier = 1,
  modifier = 0,
): RollFunction => {
  const die = createDie(sides);
  const dice = multipleDice(die)(multiplier);
  return addToRoll(modifier)(dice);
};

export const combineDice = (dice: RollFunction[]): RollFunction => {
  if (dice.length === 0) {
    throw new Error("The dice array must contain at least one roll function.");
  }
  return () => dice.reduce((acc: number, roll) => acc + roll(), 0);
};

export const parseDiceString: Unary<string, RollFunction> = (diceString) => {
  const sanitized = diceString
    .toLowerCase()
    .replace(/\s/g, "")
    .replace("-", "+-");

  const tokens = sanitized.split("+");

  const modifierTokens = tokens
    .filter((s) => s.includes("d") === false)
    .map((s) => parseInt(s, 10));
  const modifier = sumArray(modifierTokens);

  const diceTokens = tokens
    .filter((s) => s.includes("d"))
    .map((s) => s.replace(/^d/g, "1d"));

  const dicePairs = diceTokens.map((dieToken) =>
    dieToken.split("d").map((s) => parseInt(s, 10)),
  );

  const [low, high] = dicePairs.reduce(
    (limits, [multiplier, sides]) => {
      limits[0] += multiplier * 1;
      limits[1] += multiplier * sides;
      return limits;
    },
    [0, 0],
  );

  const megaDie = addToRoll(modifier)(() => randomIntegerBetween(high, low));

  // console.log(`parseDiceString("${diceString}");`);
  // console.log(`  Sanitized string: "${sanitized}"`);
  // console.log(`  Extracted tokens: ${tokens}`);
  // console.log(`  Total modifier: ${modifier}`);
  // console.log(`  Dice Tokens: ${diceTokens}`);
  // console.log(`  Dice pairs: ${dicePairs}`);
  // console.log(`  Low / High dice range: ${low} / ${high} + ${modifier}`);

  return megaDie;
};
