const eslintConfigPrettier = require('eslint-config-prettier');
const globals = require("globals");

module.exports = [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.jest
      }
    },
    rules: {
      "no-console": "warn",   
      "eqeqeq": "error",      
      "no-unused-vars": "warn" 
    }
  },
  eslintConfigPrettier
];