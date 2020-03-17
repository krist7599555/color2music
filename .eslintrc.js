module.exports = {
  root: true,
  env:  {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    "no-console":                               process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger":                              process.env.NODE_ENV === "production" ? "error" : "off",
    "@typescript-eslint/no-empty-function":     "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/ban-ts-ignore":         "off",
    "@typescript-eslint/camelcase":             "off",
    "@typescript-eslint/no-explicit-any":       'off',
    "key-spacing":                              [
      "error",
      {
        multiLine: {
          beforeColon: false,
          afterColon:  true
        },
        align: {
          beforeColon: false,
          afterColon:  true,
          on:          "value"
        }
      }
    ]
  }
};
