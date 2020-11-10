import {
  NumberGenerator,
  Sides,
  Modifier,
  Multiplier,
  DiceTokensWithModifier,
  DiceToken,
} from "./types";
import {
  sumArray,
  callAndAdd,
  callMultipleTimes,
  randomElement,
  randomIntegerBetween,
} from "./utils";

const { random: defaultRNG } = Math;

export const createDieWith = (r: NumberGenerator) => (
  sides: Sides,
): NumberGenerator => () => randomIntegerBetween(r)(sides, 1);
export const createDie = createDieWith(defaultRNG);

export const createCustomDieWith = (r: NumberGenerator) => <T>(
  sides: T[],
) => (): T => randomElement(r)(sides);
export const createCustomDie = createCustomDieWith(defaultRNG);

export const addToRoll = callAndAdd;
export const multipleDice = (die: NumberGenerator) => (
  multiplier: Multiplier,
): NumberGenerator => () => sumArray(callMultipleTimes(multiplier)(die));

export const createDiceWith = (r: NumberGenerator) => (
  sides: Sides,
  multiplier: Multiplier = 1,
  modifier: Modifier = 0,
): NumberGenerator => {
  const die = createDieWith(r)(sides);
  const dice = multipleDice(die)(multiplier);
  return callAndAdd(modifier)(dice);
};
export const createDice = createDiceWith(defaultRNG);

export const combineDice = (dice: NumberGenerator[]): NumberGenerator => {
  if (dice.length === 0) {
    throw new Error("The dice array must contain at least one roll function.");
  }
  return () => dice.reduce((acc: number, roll) => acc + roll(), 0);
};

const tokenizeDiceString = (diceString: string): DiceTokensWithModifier => {
  const sanitized = diceString
    .toLowerCase() // make case uniform
    .replace(/\s/g, "") // remove whitespace
    .replace("-", "+-"); // add plus signs before negative numbers

  const tokens = sanitized.split("+");

  // filter out dice tokens
  const diceTokenStrings = tokens
    .filter((s) => s.includes("d")) // dice tokens contain a "d"
    .map((s) => s.replace(/^d/g, "1d")); // add an implicit 1 to any dice without multipliers

  // filter out modifier tokens
  const modifierTokens = tokens
    .filter((s) => s.includes("d") === false) // these tokens contain no "d"
    .map((s) => parseInt(s, 10)); // Convert to integers

  // create tuples ([Multiplier, Sides]) from the dice tokens.
  const diceTokens: DiceToken[] = diceTokenStrings.map(
    (dieToken) => dieToken.split("d").map((s) => parseInt(s, 10)) as DiceToken,
  );

  // Reduce the modifier to one number
  const modifier: Modifier = sumArray(modifierTokens);

  // return a tuple containing the dice token array and the modifier.
  return [diceTokens, modifier];
};

export const parseDiceStringWith = (r: NumberGenerator) => (
  diceString: string,
): NumberGenerator => {
  const [diceTokens, modifier]: DiceTokensWithModifier = tokenizeDiceString(
    diceString,
  );

  const addModifier = callAndAdd(modifier);
  const dice = diceTokens.map(([multiplier, sides]) =>
    createDiceWith(r)(sides, multiplier),
  );

  return addModifier(combineDice(dice));
};

export const parseDiceString = parseDiceStringWith(defaultRNG);
