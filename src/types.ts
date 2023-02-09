export type Unary<Param, Return> = (_: Param) => Return;
export type NumberGenerator = () => number;
export type Modifier = number;
export type Multiplier = number;
export type Sides = number;
export type DiceToken = [Multiplier, Sides];
export type DiceTokensWithModifier = [DiceToken[], Modifier];
export type Range = [number, number];
