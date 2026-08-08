import baseConfig from '../../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: '@island.is/island-ui/core',
              message:
                'Cannot self reference library. Please us a relative import within @island.is/island-ui/core',
            },
          ],
        },
      ],
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
