import nextPlugin from '@next/eslint-plugin-next'
import baseConfig from '../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'
import globals from 'globals'

export default [
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  nextPlugin.configs['core-web-vitals'],
  { languageOptions: { globals: { ...globals.jest } } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@next/next/no-html-link-for-pages': [
        'error',
        'apps/consultation-portal/pages',
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
