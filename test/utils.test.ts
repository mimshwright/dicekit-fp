import { count, identity, callMultipleTimes, min, max } from "../src/utils";

// Test the test utils.

describe("test utils", () => {
  describe("identity()", () => {
    it("Takes an argument, a, returns a function that returns a (ignoring any arguments provided to it). ", () => {
      expect(identity(1)()).toBe(1);
      expect(identity("foo")("bar")).toBe("foo");
    });
  });

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

  describe("count()", () => {
    it("Counts instances of an element within an array.", () => {
      const nums = [1, 1, 1, 1, 1, 2, 3, 4, 5];
      expect(count("hello")([])).toBe(0);
      expect(count(1)(nums)).toBe(5);
      expect(count(5)(nums)).toBe(1);
      expect(count(6)(nums)).toBe(0);
    });
  });
});
