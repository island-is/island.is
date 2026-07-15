import { FlatCompat } from '@eslint/eslintrc'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import js from '@eslint/js'
import baseConfig from '../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'
import globals from 'globals'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
})

export default [
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  ...compat.extends('plugin:@next/next/recommended-legacy'),
  { languageOptions: { globals: { ...globals.jest } } },
  ...compat
    .config({
      plugins: ['simple-import-sort'],
    })
    .map((config) => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
      rules: {
        ...config.rules,
        '@next/next/no-html-link-for-pages': [
          'error',
          'apps/contentful-apps/pages',
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
    })),
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
