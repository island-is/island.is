import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    rules: {},
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
  {
    files: ['**/schema.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/naming-convention': 'off',
    },
  },
  {
    files: ['**/cms.service.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
]
