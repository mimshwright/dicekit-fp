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
