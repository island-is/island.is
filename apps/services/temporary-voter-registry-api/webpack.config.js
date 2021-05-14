// Found in issue https://github.com/nrwl/nx/issues/2147
const webpack = require('webpack')

const swaggerPluginOptions = {
  dtoFileNameSuffix: ['.dto.ts', '.model.ts'],
  classValidatorShim: true,
  introspectComments: true,
}

module.exports = (config) => {
  const tsLoader = config.module.rules.find((rule) =>
    rule.loader.includes('ts-loader'),
  )

  if (tsLoader) {
    tsLoader.options.transpileOnly = false // required because if true, plugin can't work properly
    tsLoader.options.getCustomTransformers = (program) => {
      return {
        before: [
          require('@nestjs/swagger/plugin').before(
            swaggerPluginOptions,
            program,
          ),
        ],
      }
    }
  }

  config.plugins = [
    ...(config.plugins || []),
    new webpack.ProvidePlugin({
      openapi: '@nestjs/swagger',
    }),
  ]

  config.entry = {
    ...config.entry,
    buildOpenApi:
      './apps/services/temporary-voter-registry-api/src/buildOpenApi.ts',
  }
  config.output.filename = '[name].js'
  return {
    ...config,
  }
}
