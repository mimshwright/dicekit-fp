# dicekit-fp

A functional-programming-friendly library for rolling virtual dice. Provides pure-functional way to create random numbers and dice (functions that create random integers), combine and modiify the dice results, and convert strings like "2d6+2" to functions.

Instead of using objects, the library creates random number generators based on the parameters you provide. The library uses higher-order functions to modify the results in order to modify or multiply the results of the dice rolls. Most of the functions return a `() => number` (aliased in the Typescript code as `NumberGenerator`)

## Use

### Create a basic die with `createDie()`

```typescript
// takes a number of faces for the die as an argument and returns a function that generates ints.
const d6 = createDie(6);

// random int between 1 and 6
d6();
```

You can use any number (>=2) of faces

```typescript
const coinFlip = createDie(2);
const devilDie = createDie(666);
```

### Create multiple dice with a modifier in one step using `createDice()`

```typescript
// takes a number of faces, number of dice (default 1), and modifier (default +0)
const _2d6plus3 = createDice(6, 2, 3);

// Random result of rolling 2 six sided dice and adding 3 to the result.
// (1..6) + (1..6) + 3
_2d6plus3();
// Note, this is not the same as a random int between 5..15.
// Because each die gets rolled independently, the results are more likely to follow a normal distribution curve favoring the middle numbers (like 7) more than the edge numbers (like 2 and 12)

const _2d6 = createDice(6, 2);
const _1d6 = createDice(6);
```

### Combine multiple dice functions with `combineDice()`

```typescript
const d6 = createDie(6);
const d8 = createDie(8);
const two = () => 2;

const _2d6_1d8_2 = combineDice([d6, d6, d8, two]);

// generate random int
// (1..6) + (1..6) + (1..8) + 2
_2d6_1d8_2();
```

### Dice Strings

Using `parseDiceString(s)` will convert a string into a function that rolls dice based on the input. The format of the string is inspired by Tabletop RPG dice notation.

`${multiplier}d${sides}+${modifier}` Where:

- `multiplier is the number of dice (default is 1)
- `sides` is the number of sides on the dice. The range will be `1` to `sides`, inclusive.
- `modifier` is an integer to add to the total

**Examples**

- "d6" === roll one 6-sided-die`
- "2d6" === roll two 6-sided-dice and sum results`
- "3d6+2" === roll three 6-sided-dice, add 2 to the sum.`
- "2d12-2" === roll two 12-sided-dice, subtract 2 from the sum.`
- "1d12-5+2d20+4+d4" === roll one 12-sided-die, two 20-sided-dice, and one 4-sided-die subtract one (-5 + 4) from the sum.`

Whitespace and letter case are ignored.

### Custom dice with `createCustomDie()`

To create a die that isn't typical, you can use `createCustomDie()` and provide an array of dice face values.

```typescript
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
const colorDie = createCustomDie(colors);

// Generate a random color string
colorDie();

// If the values are numerical, they can be combined with other dice functions...
const weightedD6 = createCustomDie([1, 2, 3, 4, 5, 6, 6, 6]);
const d6 = createDie(6);
const funnyDice = combineDice([d6, weightedDie]);
```

### Custom Random seed

By default, the library uses `Math.random` for the rng. To use a different generator, use `init(f)` where `f` is a function that takes no arguments and returns a number, `n`, where `0.0<=n<1.0`

```typescript
const diceKit = init(randomSeed.create("my seed"));

const d6 = diceKit.createDie(6);
```

### Other functions

TBD. Meanwhile, please review `test` folder for examples.

# Library bootstrapped with TSDX

For more info, see [tsdx.io](https://tsdx.io/)

## Commands

TSDX scaffolds your new library inside `/src`.

To run TSDX, use:

```bash
npm start # or yarn start
```

This builds to `/dist` and runs the project in watch mode so any edits you save inside `src` causes a rebuild to `/dist`.

To do a one-off build, use `npm run build` or `yarn build`.

To run tests, use `npm test` or `yarn test`.

## Configuration

Code quality is set up for you with `prettier`, `husky`, and `lint-staged`. Adjust the respective fields in `package.json` accordingly.

### Jest

Jest tests are set up to run with `npm test` or `yarn test`.

You can also use `yarn test --watch` or `yarn test --coverage`

### Bundle Analysis

[`size-limit`](https://github.com/ai/size-limit) is set up to calculate the real cost of your library with `npm run size` and visualize the bundle with `npm run analyze`.

### Rollup

TSDX uses [Rollup](https://rollupjs.org) as a bundler and generates multiple rollup configs for various module formats and build settings. See [Optimizations](#optimizations) for details.

### TypeScript

`tsconfig.json` is set up to interpret `dom` and `esnext` types, as well as `react` for `jsx`. Adjust according to your needs.

## Continuous Integration

### GitHub Actions

Two actions are added by default:

- `main` which installs deps w/ cache, lints, tests, and builds on all pushes against a Node and OS matrix
- `size` which comments cost comparison of your library on every pull request using [`size-limit`](https://github.com/ai/size-limit)

## Optimizations

Please see the main `tsdx` [optimizations docs](https://github.com/palmerhq/tsdx#optimizations). In particular, know that you can take advantage of development-only optimizations:

```js
// ./types/index.d.ts
declare var __DEV__: boolean;

// inside your code...
if (__DEV__) {
  console.log("foo");
}
```

You can also choose to install and use [invariant](https://github.com/palmerhq/tsdx#invariant) and [warning](https://github.com/palmerhq/tsdx#warning) functions.

## Module Formats

CJS, ESModules, and UMD module formats are supported.

The appropriate paths are configured in `package.json` and `dist/index.js` accordingly. Please report if any issues are found.

## Named Exports

Per Palmer Group guidelines, [always use named exports.](https://github.com/palmerhq/typescript#exports) Code split inside your React app instead of your React library.

## Including Styles

There are many ways to ship styles, including with CSS-in-JS. TSDX has no opinion on this, configure how you like.

For vanilla CSS, you can include it at the root directory and add it to the `files` section in your `package.json`, so that it can be imported separately by your users and run through their bundler's loader.

## Publishing to NPM

We recommend using [np](https://github.com/sindresorhus/np).
