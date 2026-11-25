import baseConfig from '../../../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'local-rules/require-cache-control': 'error',
    },
  },
]
