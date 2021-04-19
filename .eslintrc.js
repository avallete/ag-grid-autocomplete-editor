const tsExtends = [
  'airbnb-typescript/base',
  'plugin:prettier/recommended',
  'plugin:unicorn/recommended',
  'plugin:radar/recommended',
]
const CYPRESS_TS_OVERRIDE = {
  files: ['cypress/**/*.ts'],
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  extends: [...tsExtends, 'plugin:cypress/recommended', 'plugin:chai-friendly/recommended'],
  rules: {
    'radar/no-duplicate-string': 'off',
    'radar/no-identical-functions': 'off',
    'no-new': 'off',
    'func-names': 'off',
    '@typescript-eslint/no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
}

const TS_OVERRIDE = {
  files: ['**/*.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint'],
  extends: tsExtends,
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
  overrides: [CYPRESS_TS_OVERRIDE],
}

module.exports = {
  parserOptions: {
    ecmaVersion: 6,
  },
  overrides: [TS_OVERRIDE],
}
