import pluginCypress from 'eslint-plugin-cypress'
import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
  pluginCypress.configs.recommended,
  {
    rules: {
      'no-prototype-builtins': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
]
