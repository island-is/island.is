import nextPlugin from '@next/eslint-plugin-next'
import baseConfig from '../../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import globals from 'globals'

export default [
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  nextPlugin.configs.recommended,
  { plugins: { 'simple-import-sort': eslintPluginSimpleImportSort } },
  { languageOptions: { globals: { ...globals.jest } } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@next/next/no-html-link-for-pages': [
        'error',
        'apps/tools/contentful-role-permissions/pages',
      ],
      'simple-import-sort/imports': [
        'warn',
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
              '^.+\\.?(css)$',
            ],
          ],
        },
      ],
    },
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
