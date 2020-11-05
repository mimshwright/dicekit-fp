import {
  NumberGenerator,
  Sides,
  Modifier,
  Multiplier,
  DiceTokensWithModifier,
  DiceToken,
} from "./types";
import { sumArray, callAndAdd, callMultipleTimes } from "./utils";

/// // RNGs

const _addToRoll = callAndAdd;

const _randomNumberBetween = (r: NumberGenerator) => (
  max = 1,
  min = 0,
): number => r() * (max - min) + min;

// inclusive for min and max
const _randomIntegerBetween = (r: NumberGenerator) => (
  max: number,
  min = 0,
): number => {
  // make sure max >= min
  [max, min] = [Math.max(max, min), Math.min(max, min)];
  min = Math.ceil(min);
  max = Math.floor(max);

  const result = Math.floor(r() * (max - min + 1) + min);
  return result;
};

const _randomBoolean = (r: NumberGenerator) => (): boolean => r() > 0.5;

const _randomElement = (r: NumberGenerator) => <T>(arr: T[]): T =>
  arr[_randomIntegerBetween(r)(arr.length - 1)];

const _createDie = (r: NumberGenerator) => (sides: Sides) => () =>
  _randomIntegerBetween(r)(sides, 1);

const _createCustomDie = (r: NumberGenerator) => <T>(sides: T[]) => () =>
  _randomElement(r)(sides);

const _multipleDice = (die: NumberGenerator) => (
  multiplier: Multiplier,
): NumberGenerator => () => sumArray(callMultipleTimes(multiplier)(die));

const _createDice = (r: NumberGenerator) => (
  sides: Sides,
  multiplier: Multiplier = 1,
  modifier: Modifier = 0,
): NumberGenerator => {
  const die = _createDie(r)(sides);
  const dice = _multipleDice(die)(multiplier);
  return _addToRoll(modifier)(dice);
};

const _combineDice = (dice: NumberGenerator[]): NumberGenerator => {
  if (dice.length === 0) {
    throw new Error("The dice array must contain at least one roll function.");
  }
  return () => dice.reduce((acc: number, roll) => acc + roll(), 0);
};

const _tokenizeDiceString = (diceString: string): DiceTokensWithModifier => {
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

const _parseDiceString = (r: NumberGenerator) => (diceString: string) => {
  const [diceTokens, modifier]: DiceTokensWithModifier = _tokenizeDiceString(
    diceString,
  );

  const addModifier = _addToRoll(modifier);
  const dice = diceTokens.map(([multiplier, sides]) =>
    _createDice(r)(sides, multiplier),
  );

  return addModifier(_combineDice(dice));
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const init = (r: NumberGenerator = Math.random) => ({
  random: r,
  randomNumberBetween: _randomNumberBetween(r),
  randomIntegerBetween: _randomIntegerBetween(r),
  randomInteger: _randomIntegerBetween(r),
  randomBoolean: _randomBoolean(r),
  randomElement: _randomElement(r),

  addToRoll: _addToRoll,
  createDie: _createDie(r),
  createCustomDie: _createCustomDie(r),
  multipleDice: _multipleDice,
  createDice: _createDice(r),
  combineDice: _combineDice,
  parseDiceString: _parseDiceString(r),
});

export const {
  random,
  randomNumberBetween,
  randomIntegerBetween,
  randomInteger,
  randomBoolean,
  randomElement,

  createDie,
  createCustomDie,
  multipleDice,
  addToRoll,
  createDice,
  combineDice,
  parseDiceString,
} = init(Math.random);
