import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import nx from '@nx/eslint-plugin'

import baseConfig from '../../eslint.config.mjs'

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  { plugins: { 'simple-import-sort': eslintPluginSimpleImportSort } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          allow: ['../../../infra/src/dsl'],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
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
