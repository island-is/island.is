import transformLib from './transformLib'
import { TransformOptions, ConfigAPI } from '@babel/core'

export default function (api: ConfigAPI): TransformOptions {
  const config = {
    plugins: [],
  } as TransformOptions

  if (api.env('production') && config.plugins) {
    config.plugins.push([
      'transform-imports',
      {
        ...transformLib('@island.is/island-ui/core'),
        ...transformLib('@island.is/island-ui/contentful'),
        ...transformLib(
          '@island.is/web/components',
          'apps/web/components/index.ts',
        ),
        lodash: {
          transform: 'lodash/${member}',
          preventFullImport: true,
        },
        'date-fns': {
          transform: 'date-fns/${member}',
          preventFullImport: true,
        },
      },
    ])
  }

  return config
}
