import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.ts'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js'],
    // Override or add rules here
    rules: {},
  },
]
