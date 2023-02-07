# dicekit-fp

A functional-programming-friendly library for rolling virtual dice. It provides pure-functional way to create random numbers and dice (functions that create random integers), combine and modiify the dice results, and convert strings like "2d6+2" to functions. It has no dependencies and is about 2KB minified.

Instead of using objects, the library creates random number generators based on the parameters you provide. The library uses higher-order functions to modify the results in order to modify or multiply the results of the dice rolls. Most of the functions return a `() => number` (aliased in the Typescript code as `NumberGenerator`).

The functions that produce random numbers, such as `createDie()`, typicially have two versions: one that takes a random number generator (RNG) as the first parameter and have the suffix `With` as in `createDieWith()`, the other which is already seeded with `Math.random()` as the RNG as in `createDie()`

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
// 2d6+3
const _2d6plus3 = createDice(6, 2, 3);

// Random result of rolling 2 six sided dice and adding 3 to the result.
// (1..6) + (1..6) + 3
_2d6plus3();
// Note, this is not the same as a random int between 5..15.
// Because each die gets rolled independently, the results are more likely to follow a normal distribution curve favoring the middle numbers (like 7) more than the edge numbers (like 2 and 12)

// 2d6+0
const _2d6 = createDice(6, 2);
// 1d6+0
const _1d6 = createDice(6);
```

### Combine multiple dice functions with `combineDice()`

```typescript
const d6 = createDie(6);
const d8 = createDie(8);
// always returns 2
const two = () => 2;

// 2d6+1d8+2
const _2d6_1d8_2 = combineDice([d6, d6, d8, two]);

// generate random int
// (1..6) + (1..6) + (1..8) + 2
_2d6_1d8_2();
```

### Dice Strings

Using `parseDiceString(s)` will convert a string into a function that rolls dice based on the input. The format of the string is inspired by Tabletop RPG dice notation.

`${multiplier}d${sides}+${modifier}`

Where:

- `multiplier` is the number of dice (default is 1)
- Use `d` or `D` to separate the multiplier from the number of sides on the dice.
- `sides` is the number of sides on the dice. The range will be `1` to `sides`, inclusive.
- `modifier` is an integer to add to the total

**Examples**

- "d6" -> roll one 6-sided-die`
- "2d6" -> roll two 6-sided-dice and sum results`
- "3d6+2" -> roll three 6-sided-dice, add 2 to the sum.`
- "2d12-2" -> roll two 12-sided-dice, subtract 2 from the sum.`
- "1d12-5+2d20+4+d4" -> roll one 12-sided-die, two 20-sided-dice, and one 4-sided-die, subtract 5 and add 4 to the sum.`

Whitespace and letter case are ignored.

### Custom dice with `createCustomDie()`

To create a die that isn't typical, you can use `createCustomDie()` and provide an array of dice face values.

```typescript
// Generate a random color string
const colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
const colorDie = createCustomDie(colors);
colorDie(); // "blue"

// Create a die that lands on 6 more often.
const weightedD6 = createCustomDie([1, 2, 3, 4, 5, 6, 6, 6]);
weightedD6(); // 6, probably

// If the values are numerical, they can be combined with other dice functions...
const weightedDice = combineDice([weightedDie, weightedDie]);
```

### Custom Random seed

All the fuctions that rely on a random number generator come with a version that uses `Math.random` for the RNG. To use a different generator, use the alternate versions with the suffix `With` as in `createDieWith(f)` where `f` is a function that takes no arguments and returns a number, `n`, where `0.0<=n<1.0`

```typescript
const myRNG = randomSeed.create("my seed");
const createDieSeeded = createDieWith(myRNG);

const d6 = createDieSeeded(6);
d6(); // uses myRNG for generating numbers.
```

### Other functions

TBD. Meanwhile, please review `test` folder for examples.

_Below this line is boilerplate from the template_

=====

# Vite npm package template

A template for an npm package using:

- vite
- typescript
- jest
- prettier & eslint
- controlled commits with commitizen, lint-staged, etc.
- & more!

Inspired by this post by [Onur Önder](https://onderonur.netlify.app/blog/creating-a-typescript-library-with-vite/)

## Setup

1. Install packages.
1. Edit the top of the package.json file to include the correct package name and description. You can find and replace for "\<LIBRARY\>"
1. Edit the README.md
1. You may need to review the `vite.config.js` depending on your library structure.

## Scripts

- `lint` : lint the code. You can also do `fix` to auto-fix.
- `test` : test with jest. Also `test:coverage` and `test:watch`
- `build` : bundle the code
- `commit` & `release` : see below
- `pushpub`: Used after `release` it pushes and publishes the library.
- `deploy`: Build the demo code (index.html) and publish to gh-pages

## Commits & Releases

Code is automatically linted before being committed. I recommend installing the plugins for eslint and prettier in your code editor. You can attempt to fix linting issues with `yarn fix`.

When ready to commit, please commit using `yarn commit` to use commitizen for standard format commits.

When ready to release use `yarn release` with the `-r patch|minor|major` flag (default without the flag is `patch`).

You'll then need to publish your changes separately. That can be done with `yarn pushpub`.

You can deploy an updated demo to github pages using `yarn deploy`
