module.exports = {
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'prettier',
    'plugin:import/errors',
    'plugin:import/warnings',
    // 'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier'],
  env: {
    node: true,
    commonjs: true,
    es6: true,
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2018,
  },
  rules: {
    // 'no-console': 'warn',
    'prettier/prettier': 'error',
    'no-unused-vars': 'error',
    'import/no-unresolved': 'off',
    // '@typescript-eslint/indent': [2, 2],
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', './'],
      },
    },
  },
};
