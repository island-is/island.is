import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    files: ['**/gen/**/*'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },
]
