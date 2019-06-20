module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  // "extends": "plugin:vue/essential",
  "extends": ["plugin:vue/strongly-recommended", "eslint:recommended"],
  "rules": {
    "no-extra-semi": "warn",
    "space-before-blocks": ["warn", { "functions": "always" }],
    "eqeqeq": ["warn", "always"],
    "no-multi-spaces": "warn",
    "no-eval": "error",
    "arrow-parens": ["warn", "as-needed"],
    "no-console": "off",
  },
  "globals": {
    "d3": true,
    "d3Tip": true,
    "axios": true,
    "eStatApiId": true,
    "ie": true
  }
};
