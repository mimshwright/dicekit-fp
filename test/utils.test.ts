import { describe, it, expect } from "vitest";

import {
  randomIntegerBetween,
  randomElement,
  testRollMed,
  testRollSm,
  count,
  identity,
  callMultipleTimes,
  min,
  max,
} from "../src/utils";

// Test the test utils.

describe("test utils", () => {
  describe("identity()", () => {
    it("Takes an argument, a, returns a function that returns a (ignoring any arguments provided to it). ", () => {
      expect(identity(1)()).toBe(1);
      expect(identity("foo")("bar")).toBe("foo");
    });
  });

  describe("callMultipleTimes()", () => {
    it("Should call the function multiple times.", () => {
      let x = 0;
      const testFunc = () => {
        x += 1;
      };

      callMultipleTimes(10)(testFunc);

      expect(x).toBe(10);
    });
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

  describe("count()", () => {
    it("Counts instances of an element within an array.", () => {
      const nums = [1, 1, 1, 1, 1, 2, 3, 4, 5];
      expect(count("hello")([])).toBe(0);
      expect(count(1)(nums)).toBe(5);
      expect(count(5)(nums)).toBe(1);
      expect(count(6)(nums)).toBe(0);
    });
  });

  describe("Random number generators", () => {
    describe("randomIntegerBetween()", () => {
      const randomInt = randomIntegerBetween(Math.random);

      it("Creates random numbers in a range.", () => {
        const results = testRollMed(() => randomInt(50, 10));

        expect(min(results)).toBe(10);
        expect(max(results)).toBe(50);
      });

      it("Low value defaults to 0.", () => {
        const results = testRollMed(() => randomInt(10));

        expect(min(results)).toBe(0);
        expect(max(results)).toBe(10);
      });

      it("Negative numbers work.", () => {
        const results = testRollMed(() => randomInt(-10, -50));

        expect(max(results)).toBe(-10);
        expect(min(results)).toBe(-50);
      });

      it("Range is inclusive.", () => {
        const results = testRollSm(() => randomInt(2, 1));

        expect(min(results)).toBe(1);
        expect(max(results)).toBe(2);
      });

      it("Expects max to be the first parameter and min to be the second, but if min > max, it switches them automatically.", () => {
        const resultsIncorrect = testRollSm(() => randomInt(1, 3));
        const resultsCorrect = testRollSm(() => randomInt(3, 1));

        expect(min(resultsCorrect)).toBe(1);
        expect(min(resultsIncorrect)).toBe(1);
        expect(max(resultsCorrect)).toBe(3);
        expect(max(resultsIncorrect)).toBe(3);
      });
    });

    describe("randomElement()", () => {
      it("Returns a random element from the array.", () => {
        const results = testRollMed(() =>
          randomElement(Math.random)([0, 1, 2, 3, 4, 5])
        );

        expect(min(results)).toBe(0);
        expect(max(results)).toBe(5);
      });
    });
  });
});
