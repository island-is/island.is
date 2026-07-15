import baseConfig from '../../../eslint.config.mjs'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

export default [
  ...baseConfig,
  { plugins: { 'simple-import-sort': eslintPluginSimpleImportSort } },
  {
    rules: {
      eqeqeq: ['error', 'always'],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.name=/^format(Date)?$/] > Literal[value=/^Pp?$/]',
          message:
            "Do not use the date-fns short date token 'P'/'Pp' \u2014 the Icelandic locale renders it as 'd.MM.y' (unpadded day, padded month, e.g. \"5.05.2025\"). Use an explicit padded format like 'dd.MM.y' or 'dd.MM.y HH:mm'.",
        },
      ],
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
    files: ['migrations/*.js'],
    rules: {
      eqeqeq: 'off',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^\\w', '@(?!nestjs|island\\.is)'],
            ['^@nestjs'],
            ['^@island\\.is/(?!judicial-system)'],
            ['^@island\\.is/judicial-system'],
            ['^.*createTesting.*Module$'],
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
]
