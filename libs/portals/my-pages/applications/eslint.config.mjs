import baseConfig from '../../../../eslint.config.mjs'
import nx from '@nx/eslint-plugin'

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'scope:portals-mypages',
              onlyDependOnLibsWithTags: [
                'lib:application-system',
                'lib:portals-mypages',
                'lib:portals',
                'lib:react-spa',
                'lib:react',
                'lib:dom',
                'lib:js',
              ],
            },
          ],
        },
      ],
    },
  },
]
