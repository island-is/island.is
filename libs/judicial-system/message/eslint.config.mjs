import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

import baseConfig from '../../../eslint.config.mjs'

export default [
  ...baseConfig,
  { plugins: { 'simple-import-sort': eslintPluginSimpleImportSort } },
  {
    rules: {
      eqeqeq: ['error', 'always'],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\w', '@(?!nestjs|island\\.is)'],
            ['^@nestjs'],
            ['^@island\\.is/(?!judicial-system)'],
            ['^@island\\.is/judicial-system'],
            [
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
            ],
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
