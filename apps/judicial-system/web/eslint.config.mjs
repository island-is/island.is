import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import baseConfig from '../../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
})

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  ...compat.extends('plugin:jsx-a11y/strict'),
  {
    plugins: {
      'jsx-a11y': eslintPluginJsxA11y,
      'simple-import-sort': eslintPluginSimpleImportSort,
    },
  },
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
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'jsx-a11y/no-autofocus': [
        2,
        {
          ignoreNonDOM: true,
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^\\w', '^@(?!island).+'],
            ['^(@island.is).*'],
            [
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
              '^.+\\.?(strings)$',
              '^.+\\.?(css)$',
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
    files: ['**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    ignores: ['/src/graphql/schema.tsx', '/public/**'],
  },
]
