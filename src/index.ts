import {
  NumberGenerator,
  Unary,
  Sides,
  Modifier,
  Multiplier,
  DiceTokensWithModifier,
  DiceToken,
} from "./types";
import { sumArray, callAndAdd, callMultipleTimes } from "./utils";

/// // RNGs

const r: NumberGenerator = Math.random;

export const random = r;

export const randomNumberBetween = (max = 1, min = 0): number =>
  r() * (max - min) + min;

// inclusive for min and max
export const randomIntegerBetween = (max: number, min = 0): number => {
  // make sure max >= min
  [max, min] = [Math.max(max, min), Math.min(max, min)];
  min = Math.ceil(min);
  max = Math.floor(max);

  const result = Math.floor(r() * (max - min + 1) + min);
  return result;
};

// Unary version of randomIntegerBetween
// Returns a number between 0 and n
export const randomInteger: Unary<number, number> = randomIntegerBetween;

export const randomBoolean = (): boolean => r() > 0.5;

export const randomElement: <T>(arr: T[]) => T = (arr) =>
  arr[randomInteger(arr.length - 1)];

/// // Dice

export const createDie: Unary<Sides, NumberGenerator> = (sides: Sides) => () =>
  randomIntegerBetween(sides, 1);

export const multipleDice = (die: NumberGenerator) => (
  multiplier: Multiplier,
): NumberGenerator => () => sumArray(callMultipleTimes(multiplier)(die));

export const addToRoll = callAndAdd;

export const createDice = (
  sides: Sides,
  multiplier: Multiplier = 1,
  modifier: Modifier = 0,
): NumberGenerator => {
  const die = createDie(sides);
  const dice = multipleDice(die)(multiplier);
  return addToRoll(modifier)(dice);
};

export const combineDice = (dice: NumberGenerator[]): NumberGenerator => {
  if (dice.length === 0) {
    throw new Error("The dice array must contain at least one roll function.");
  }
  return () => dice.reduce((acc: number, roll) => acc + roll(), 0);
};

/// // string parsing

const tokenizeDiceString: Unary<string, DiceTokensWithModifier> = (
  diceString,
) => {
  // fix formatting
  const sanitized = diceString
    // make case uniform
    .toLowerCase()
    // remove whitespace
    .replace(/\s/g, "")
    // add plus signs before negative numbers
    .replace("-", "+-");

  // Split on plus signs
  const tokens = sanitized.split("+");

  // filter out dice tokens
  const diceTokenStrings = tokens
    // dice tokens contain a "d"
    .filter((s) => s.includes("d"))
    // add an implicit 1 to any dice without multipliers
    .map((s) => s.replace(/^d/g, "1d"));

  // filter out modifier tokens
  const modifierTokens = tokens
    // these tokens contain no "d"
    .filter((s) => s.includes("d") === false)
    // Convert to integers
    .map((s) => parseInt(s, 10));

  // create tuples ([Multiplier, Sides]) from the dice tokens.
  const diceTokens: DiceToken[] = diceTokenStrings.map(
    // Split on "d"
    (dieToken) =>
      dieToken
        .split("d")
        // convert to ints.
        .map((s) => parseInt(s, 10)) as DiceToken,
  );

  // combine the modifier into one number
  const modifier: Modifier = sumArray(modifierTokens);

  // console.log(`parseDiceString("${diceString}");`);
  // console.log(`  Sanitized string: "${sanitized}"`);
  // console.log(`  Extracted tokens: ${tokens}`);
  // console.log(`  Dice Tokens: ${diceTokens.map((d) => d.join("x")).join(",")}`);
  // console.log(`  Total modifier: ${modifier}`);

  // return a tuple containing the dice token array and the modifier.
  return [diceTokens, modifier];
};

export const parseDiceString: Unary<string, NumberGenerator> = (diceString) => {
  const [diceTokens, modifier]: DiceTokensWithModifier = tokenizeDiceString(
    diceString,
  );

  const addModifier = addToRoll(modifier);
  const dice = diceTokens.map(([multiplier, sides]) =>
    createDice(sides, multiplier),
  );

  return addModifier(combineDice(dice));
};
