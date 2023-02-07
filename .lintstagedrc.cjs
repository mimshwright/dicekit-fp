module.exports = {
  "*": "yarn lint:prettier",
  "*.ts{,x}": () => "yarn build:tsc",
  "*.{j,t}s{,x}": ["yarn lint:eslint", () => "yarn test"],
};
