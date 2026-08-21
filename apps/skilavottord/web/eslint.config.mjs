import baseConfig from '../../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'

export default [
  { ignores: ['**/translation.d.ts'] },
  ...baseConfig,
  ...nx.configs['flat/react'],
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
    },
  },
  {
    ignores: ['translation.d.ts'],
  },
]
