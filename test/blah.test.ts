import { identity, callMultipleTimes, min, max } from "../src/utils";
import {
  random,
  randomBoolean,
  randomIntegerBetween,
  randomInteger,
  createDie,
  createDice,
  multipleDice,
  combineDice,
  parseDiceString,
  addToRoll,
} from "../src/index";

const testRoll = callMultipleTimes;

const testRollSm = testRoll(200);
const testRollMed = testRoll(1000);
const testRollLrg = testRoll(5000);
const testRollXLrg = testRoll(100000);

describe("dicekit", () => {
  describe("[WARNING: In rare cases, these tests can fail due to random values. Please test again if this happens or raise the number of testRolls!]", () => {
    describe("random()", () => {
      it("Returns a value between 0 and 1", () => {
        const results = testRollMed(random);

        expect(min(results)).toBeGreaterThan(0);
        expect(max(results)).toBeLessThan(1);
      });
    });

    describe("randomIntegerBetween()", () => {
      it("Creates random numbers in a range.", () => {
        const results = testRollMed(() => randomIntegerBetween(50, 10));

        expect(min(results)).toBe(10);
        expect(max(results)).toBe(50);
      });

      it("Low value defaults to 0.", () => {
        const results = testRollMed(() => randomIntegerBetween(10));

        expect(min(results)).toBe(0);
        expect(max(results)).toBe(10);
      });

      it("Negative numbers work.", () => {
        const results = testRollMed(() => randomIntegerBetween(-10, -50));

        expect(max(results)).toBe(-10);
        expect(min(results)).toBe(-50);
      });

      it("Range is inclusive.", () => {
        const results = testRollSm(() => randomIntegerBetween(2, 1));

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(2);
      });

      it("Expects max to be the first parameter and min to be the second, but if min > max, it switches them automatically.", () => {
        const resultsIncorrect = testRollSm(() => randomIntegerBetween(1, 3));
        const resultsCorrect = testRollSm(() => randomIntegerBetween(3, 1));

        expect(min(resultsCorrect)).toBe(1);
        expect(min(resultsIncorrect)).toBe(1);
        expect(max(resultsCorrect)).toBe(3);
        expect(max(resultsIncorrect)).toBe(3);
      });
    });

    describe("randomInteger()", () => {
      it("Is a unary form of randomIntegerBetween(). Only takes a maximum and assumes minimum is 0.", () => {
        const results = testRollMed(() => randomInteger(10));
        const resultsBetween = testRollMed(() => randomIntegerBetween(10, 0));

        expect(min(results)).toBe(min(resultsBetween));
        expect(max(results)).toBe(max(resultsBetween));
      });
    });
    describe("randomBoolean()", () => {
      it("Is syntactic sugar for randomIntegerBetween(0,1) coerced to a boolean value", () => {
        const results = testRoll(100)(randomBoolean);
        const trueCount = results.filter((b) => b === true).length;
        const falseCount = results.filter((b) => b === false).length;

        expect(trueCount).toBeGreaterThan(35);
        expect(falseCount).toBe(100 - trueCount);
      });
    });

    describe("createDie()", () => {
      it("Returns a function that generates random numbers between 1 and 'sides'", () => {
        const d6 = createDie(6);
        const results = testRollSm(d6);

        expect(d6).toBeInstanceOf(Function);
        expect(min(results)).toBe(1);
        expect(max(results)).toBe(6);
      });
      it("Range is inclusive'", () => {
        const coinFlip = createDie(2);
        const results = testRollSm(coinFlip);

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(2);
      });
    });

    describe("multipleDice()", () => {
      it("Takes a die function and returns a function that calls it multiple times.", () => {
        const d6 = createDie(6);
        const multipleD6 = multipleDice(d6);
        const d6x3 = multipleD6(3);
        const results = testRollLrg(d6x3);

        expect(multipleD6).toBeInstanceOf(Function);
        expect(d6x3).toBeInstanceOf(Function);

        expect(min(results)).toBe(3);
        expect(max(results)).toBe(18);
        // make sure it's generating numbers in between
        expect(results.indexOf(4)).toBeGreaterThanOrEqual(0);

        const coin = createDie(2);
        const coinx10 = multipleDice(coin)(10);
        const flips = testRollLrg(coinx10);

        expect(min(flips)).toBe(10);
        expect(max(flips)).toBe(20);
      });
    });

    describe("constant()", () => {
      it("Takes a number value and returns a function that always returns that number. K-combinator", () => {
        const one = identity(1);

        expect(one).toBeInstanceOf(Function);
        expect(one()).toBe(1);
        expect(identity(0)()).toBe(0);
        expect(identity(999)()).toBe(999);
      });
    });

    describe("addToRoll()", () => {
      it("Takes a function that returns a number. When called, it calls the function and adds a constant value to the result.", () => {
        const d6 = createDie(6);
        const plus2 = addToRoll(2);
        const d6plus2 = plus2(d6);
        const results = testRollLrg(d6plus2);
        expect(min(results)).toBe(3);
        expect(max(results)).toBe(8);

        const multipleD6 = multipleDice(d6);
        const d6x3plus2 = plus2(multipleD6(3));
        const resultsMultiple = testRollLrg(d6x3plus2);
        expect(min(resultsMultiple)).toBe(5);
        expect(max(resultsMultiple)).toBe(20);
      });
    });

    describe("createDice()", () => {
      describe("Creates multiple dice (all of the same number of sides) and adds a modifier to the result.", () => {
        it("Creates several dice and adds a fixed number to the output.", () => {
          const _2d6plus4 = createDice(6, 2, 4);

          const result = testRollLrg(_2d6plus4);
          expect(min(result)).toBe(2 * 1 + 4);
          expect(max(result)).toBe(2 * 6 + 4);
        });
        it("Uses 0 for the default modifier.", () => {
          const _2d6 = createDice(6, 2);

          const result = testRollLrg(_2d6);
          expect(min(result)).toBe(2 * 1 + 0);
          expect(max(result)).toBe(2 * 6 + 0);
        });
        it("Uses 1 for the default multiplier.", () => {
          const _d6 = createDice(6);
          const result = testRollLrg(_d6);
          expect(min(result)).toBe(1 * 1 + 0);
          expect(max(result)).toBe(1 * 6 + 0);
        });
      });
    });

    describe("combineDice()", () => {
      describe("Takes an array of dice roll functions and returns one that combines the results of all.", () => {
        it("Is a function that returns a function.", () => {
          const one = identity(1);
          const combined = combineDice([one]);

          expect(combineDice).toBeInstanceOf(Function);
          expect(combined).toBeInstanceOf(Function);
          expect(combined()).toBe(1);
        });

        it("Array must not be empty", () => {
          expect(() => {
            combineDice([]);
          }).toThrow();
        });

        it("Combines dice functions. Functions must be in the form `() => number`", () => {
          const d6 = createDie(6);
          const plus2 = identity(2);

          const _2d6plus2 = combineDice([d6, d6, plus2]);
          expect(_2d6plus2).toBeInstanceOf(Function);

          const results = testRollMed(_2d6plus2);
          expect(min(results)).toBe(4);
          expect(max(results)).toBe(14);

          const d8 = createDie(8);
          const d12 = createDie(12);
          const _2d12 = multipleDice(d12)(2);
          const _2d12plus3 = addToRoll(3)(_2d12);

          const _2d12plus3plus1d8minus5 = combineDice([
            _2d12plus3,
            d8,
            identity(-5),
          ]);

          const results2 = testRollXLrg(_2d12plus3plus1d8minus5);
          expect(min(results2)).toBe(2 + 3 + 1 - 5);
          expect(max(results2)).toBe(2 * 12 + 3 + 8 - 5);
        });
      });
    });

    describe("parseDiceString()", () => {
      const p = parseDiceString;
      describe("Takes strings in the format `NdS+K` and converts to a dice rolling function. e.g. 2d6+4 => Roll 2x 6-sided dice and add +4 to the result. ", () => {
        it("Basic function", () => {
          const _2d6plus4 = p("2d6+4");

          const result = testRollLrg(_2d6plus4);
          expect(min(result)).toBe(2 * 1 + 4);
          expect(max(result)).toBe(2 * 6 + 4);
        });

        it("Whitespace ignored.", () => {
          const _2d6plus4 = p(`2 d6    + 
          4`);

          const result = testRollLrg(_2d6plus4);
          expect(min(result)).toBe(2 * 1 + 4);
          expect(max(result)).toBe(2 * 6 + 4);
        });

        it("Case insensitive.", () => {
          const _2d6plus4 = p(`2D6+4`);

          const result = testRollLrg(_2d6plus4);
          expect(min(result)).toBe(2 * 1 + 4);
          expect(max(result)).toBe(2 * 6 + 4);
        });

        it("Negative modifiers work as expected", () => {
          const _3d6minus2 = p("3d6-2");

          const result = testRollLrg(_3d6minus2);
          expect(min(result)).toBe(3 * 1 - 2);
          expect(max(result)).toBe(3 * 6 - 2);
        });
        it("Multiple modifiers are all summed", () => {
          const _2d6plus4 = p("2d6+2+1+1");

          const result = testRollLrg(_2d6plus4);
          expect(min(result)).toBe(2 * 1 + 4);
          expect(max(result)).toBe(2 * 6 + 4);
        });
        it("Modifiers can come before the dice.", () => {
          const _2d6plus4 = p("4+2d6");

          const result = testRollLrg(_2d6plus4);
          expect(min(result)).toBe(2 * 1 + 4);
          expect(max(result)).toBe(2 * 6 + 4);
        });

        it("Dice can be split up.", () => {
          const _2d6plus4 = p("1d6+2+1d6+2");

          const result = testRollLrg(_2d6plus4);
          expect(min(result)).toBe(2 * 1 + 4);
          expect(max(result)).toBe(2 * 6 + 4);
        });

        it("Multiplier assumed to be 1 if not specified", () => {
          const _d6plus2 = p("d6+2");

          const result = testRollLrg(_d6plus2);
          expect(min(result)).toBe(1 * 1 + 2);
          expect(max(result)).toBe(1 * 6 + 2);
        });

        it("Modifier optional.", () => {
          const _2d6 = p("2d6");
          const result = testRollLrg(_2d6);
          expect(min(result)).toBe(2 * 1);
          expect(max(result)).toBe(2 * 6);

          const _2d6plus2d12 = p("2d6+2d12");
          const result2 = testRollXLrg(_2d6plus2d12);
          expect(min(result2)).toBe(2 * 1 + 2 * 1);
          expect(max(result2)).toBe(2 * 6 + 2 * 12);
        });
      });
    });
  });
});
