import {
  randomBoolean,
  createDie,
  randomIntegerBetween,
  randomInteger,
} from "../src/index";

const callMultipleTimes = (times: number) => (func: () => any) =>
  new Array(times).fill(0).map(func);

const max = (nums: number[]) =>
  nums.reduce((a, b) => Math.max(a, b), Number.NEGATIVE_INFINITY);

const min = (nums: number[]) =>
  nums.reduce((a, b) => Math.min(a, b), Number.POSITIVE_INFINITY);

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
  describe("[WARNING: In rare cases, these tests can fail due to random values. Please test again if this happens!]", () => {
    describe("randomIntegerBetween()", () => {
      it("Creates random numbers in a range.", () => {
        const results = callMultipleTimes(500)(() =>
          randomIntegerBetween(50, 10),
        );

        expect(min(results)).toBe(10);
        expect(max(results)).toBe(50);
      });

      it("Low value defaults to 0.", () => {
        const results = callMultipleTimes(100)(() => randomIntegerBetween(10));

        expect(min(results)).toBe(0);
        expect(max(results)).toBe(10);
      });

      it("Negative numbers work.", () => {
        const results = callMultipleTimes(500)(() =>
          randomIntegerBetween(-10, -50),
        );

        expect(min(results)).toBe(-50);
        expect(max(results)).toBe(-10);
      });

      it("Range is inclusive.", () => {
        const results = callMultipleTimes(50)(() => randomIntegerBetween(1, 2));

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(2);
      });
    });

    describe("randomInteger()", () => {
      it("Is a unary form of randomIntegerBetween()", () => {
        const results = callMultipleTimes(100)(() => randomInteger(10));
        const resultsBetween = callMultipleTimes(100)(() =>
          randomIntegerBetween(10, 0),
        );

        expect(min(results)).toBe(min(resultsBetween));
        expect(max(results)).toBe(max(resultsBetween));
      });
    });
    describe("randomBoolean()", () => {
      it("Is syntactic sugar for randomIntegerBetween(0,1) coerced to a boolean value", () => {
        const results = callMultipleTimes(100)(randomBoolean);
        const trueCount = results.filter((b) => b).length;

        expect(trueCount).toBeGreaterThan(40);
      });
    });

    describe("createDie()", () => {
      it("Returns a function that generates random numbers between 1 and 'sides'", () => {
        const d6 = createDie(6);
        const results = callMultipleTimes(60)(d6);

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(6);
      });
      it("Range is inclusive'", () => {
        const coinFlip = createDie(2);
        const results = callMultipleTimes(50)(coinFlip);

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(2);
      });
    });
  });
});
