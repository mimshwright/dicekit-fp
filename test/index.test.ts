import {
  identity,
  testRollSm,
  testRollMed,
  testRollLrg,
  testRollXLrg,
  min,
  max,
  count,
} from "../src/utils";
import { NumberGenerator } from "../src/types";
import {
  createDieWith,
  createDie,
  createCustomDieWith,
  createCustomDie,
  createDiceWith,
  createDice,
  parseDiceStringWith,
  parseDiceString,
  multipleDice,
  combineDice,
  addToRoll,
} from "../src/index";

describe("dicekit", () => {
  const tbf = (f: any) => expect(f).toBeInstanceOf(Function);
  describe("createDieWith() &c.", () => {
    describe("Creates a die with your choice of RNG.", () => {
      it("Every random function has a version that allows you to specify the RNG.", () => {
        tbf(createDieWith);
        tbf(createDiceWith);
        tbf(createCustomDieWith);
        tbf(parseDiceStringWith);
      });
      it("Versions that use Math.random by default are also exported.", () => {
        tbf(createDie);
        tbf(createDice);
        tbf(createCustomDie);
        tbf(parseDiceString);
      });

      it("Can take any function that returns numbers, n, where 0.0>=n<1.0 ", () => {
        const sequence = [0.0, 0.2, 0.4, 0.6, 0.8, 0.99999999];
        let i = 0;
        const sequencedNumberGenerator = () => {
          const result = sequence[i];
          i = (i + 1) % sequence.length;
          return result;
        };

        const die = createDieWith(sequencedNumberGenerator)(6);
        expect(die()).toBe(1);
        expect(die()).toBe(2);
        expect(die()).toBe(3);
        expect(die()).toBe(4);
        expect(die()).toBe(5);
        expect(die()).toBe(6);
        expect(die()).toBe(1);
      });
    });
  });

  describe("[WARNING: In rare cases, these tests can fail due to random values. Please test again if this happens or raise the number of testRolls!]", () => {
    describe("createDie()", () => {
      it("Returns a function that generates random numbers between 1 and 'sides'", () => {
        const d6 = createDie(6);
        const results = testRollSm(d6);

        tbf(d6);
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

    describe("createCustomDie()", () => {
      it("Returns a generator that maps each side to a different value.", () => {
        const weightedDie: NumberGenerator = createCustomDie([
          1,
          2,
          2,
          3,
          3,
          3,
          3,
          4,
          4,
          5,
        ]);
        const results = testRollMed(weightedDie);
        const count1 = count(1)(results);
        const count3 = count(3)(results);

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(5);
        expect(count3 / count1).toBeGreaterThan(3);
      });
      it("Can return a NumberGenerator or another type of generator.", () => {
        const colors = [
          "red",
          "orange",
          "yellow",
          "green",
          "blue",
          "indigo",
          "violet",
        ];
        const colorDie = createCustomDie(colors);
        const results = testRollSm(colorDie);

        expect(results[0]).toHaveProperty("length");
        colors.forEach((c) => expect(count(c)(results)).toBeGreaterThan(10));

        expect(createCustomDie([new Date()])()).toBeInstanceOf(Date);
      });

      it("Can still be combined with other functions if it's a number generator", () => {
        const ones = createDie(10);
        const tens = createCustomDie([10, 20, 30, 40, 50, 60, 70, 80, 90, 0]);

        const hundredSided = combineDice([ones, tens]);

        const results = testRollLrg(hundredSided);
        expect(min(results)).toBe(1);
        expect(max(results)).toBe(100);
      });
    });

    describe("multipleDice()", () => {
      it("Takes a die function and returns a function that calls it multiple times.", () => {
        const d6 = createDie(6);
        const multipleD6 = multipleDice(d6);
        const d6x3 = multipleD6(3);
        const results = testRollLrg(d6x3);

        tbf(multipleD6);
        tbf(d6x3);

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

          tbf(combineDice);
          tbf(combined);
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
          tbf(_2d6plus2);

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

        it("Should fail if you provide a number of dice which are < 0", () => {
          const _neg2d6 = p("-2d6");
          const result = testRollLrg(_neg2d6);

          // todo: add more helpful error.

          expect(min(result)).toBe(NaN);
          expect(max(result)).toBe(NaN);
        });
      });
    });
  });
});
