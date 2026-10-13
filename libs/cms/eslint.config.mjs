import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'local-rules/require-cache-control': 'error',
    },
  },
  {
    ignores: ['contentfulTypes.d.ts'],
  },
]
