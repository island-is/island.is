import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
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
