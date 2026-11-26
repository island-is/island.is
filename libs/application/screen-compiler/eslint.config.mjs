import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
  {
    rules: {
      // Replaces the base rule, so its paths are repeated here.
      'no-restricted-imports': [
        'error',
        {
          paths: [
            'lodash',
            'date-fns',
            'date-fns/locale',
            'styled-components',
            '.',
          ],
          patterns: [
            {
              group: ['react', 'react-dom', 'react/*', 'react-dom/*'],
              message:
                'screen-compiler must remain React-free for server-side use.',
            },
          ],
        },
      ],
    },
  },
]
