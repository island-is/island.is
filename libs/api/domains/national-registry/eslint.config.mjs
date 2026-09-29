import baseConfig from '../../../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
    },
  },
]
