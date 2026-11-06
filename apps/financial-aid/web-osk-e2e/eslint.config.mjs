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
]
