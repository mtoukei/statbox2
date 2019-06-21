module.exports = {
  "root": true,
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  // "extends": "plugin:vue/essential",
  "extends": ["plugin:vue/strongly-recommended", "eslint:recommended"],
  "rules": {
    "space-before-blocks": ["warn", { "functions": "always" }],
    "eqeqeq": ["warn", "always"],
    "no-multi-spaces": "warn",
    "no-eval": "error",
    "arrow-parens": ["warn", "as-needed"],
    "arrow-spacing": "warn",
    "prefer-const": "warn",
    "comma-spacing": ["warn", {"before": false, "after": true}],
    "block-spacing": "warn",
    "key-spacing": ["warn", {"beforeColon": false, "afterColon": true}],
    "space-infix-ops": "warn",
    "no-unneeded-ternary": "warn",
    "no-implicit-coercion": "warn",
    "no-else-return": "warn",
    "no-console": "off",
  },
  "parserOptions": {
    "parser": "babel-eslint"
  },
  "globals": {
    "d3": true,
    "d3Tip": true,
    "axios": true,
    "eStatApiId": true,
    "ie": true
  }
};
