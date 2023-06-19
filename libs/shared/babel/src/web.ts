import { TransformOptions, ConfigAPI, PluginItem } from '@babel/core'
import { workspaceRoot } from '@nx/devkit'
import transformLib from './transformLib'

export default function (api: ConfigAPI): TransformOptions {
  const config: TransformOptions = {
    plugins: [],
  }

  config.plugins?.push('@vanilla-extract/babel-plugin')

  if (api.env('production') && config.plugins) {
    config.plugins.push([
      'transform-imports',
      {
        ...transformLib('@island.is/island-ui/core'),
        ...transformLib('@island.is/island-ui/contentful'),
        ...transformLib(
          '@island.is/web/components',
          `${workspaceRoot}/apps/web/components/real.ts`,
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
