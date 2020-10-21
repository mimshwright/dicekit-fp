import {
  random,
  addToRoll,
  callMultipleTimes,
  randomBoolean,
  randomIntegerBetween,
  randomInteger,
  createDie,
  multipleDice,
} from "../src/index";

const max = (nums: number[]) =>
  nums.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);

const min = (nums: number[]) =>
  nums.reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);

const testRoll = callMultipleTimes;

const testRollSm = testRoll(200);
const testRollMed = testRoll(1000);
const testRollLrg = testRoll(5000);

// Test the test utils.

describe("test utils", () => {
  describe("callMultipleTimes()", () => {
    let x = 0;
    const testFunc = () => {
      x += 1;
    };

    callMultipleTimes(10)(testFunc);

    expect(x).toBe(10);
  });

  describe("min()", () => {
    it("Returns the minimum value in a number[].", () => {
      expect(min([9, 50, 7, 1, -13, 102])).toBe(-13);
    });
  });

  describe("max()", () => {
    it("Returns the maximum value in a number[].", () => {
      expect(max([9, 50, 7, 1, -13, 102])).toBe(102);
    });
  });
});

// Test the main library.

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

        expect(min(results)).toBe(-50);
        expect(max(results)).toBe(-10);
      });

      it("Range is inclusive.", () => {
        const results = testRollSm(() => randomIntegerBetween(1, 2));

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(2);
      });
    });

    describe("randomInteger()", () => {
      it("Is a unary form of randomIntegerBetween()", () => {
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
  });
});
