const { esbuildDecorators } = require('@anatine/esbuild-decorators')
const { workspaceRoot } = require('@nx/devkit')

/** @typedef {import('esbuild').BuildOptions} EsbuildBuildOptions */
/**
 * @param {EsbuildBuildOptions | undefined} config
 * @returns {EsbuildBuildOptions}
 */
const esbuildConfig = (config = {}) => {
  const { external, ...rest } = config

  return {
    // @nx/esbuild plugins ignores the extension of outputFileName in project.json
    outExtension: {
      '.js': '.js',
    },
    keepNames: true,
    sourcesContent: false,
    sourcemap: true,
    plugins: [
      // Require this plugin to handle emitDecoratorMetadata and experimentalDecorators
      esbuildDecorators({
        cwd: `${workspaceRoot}/apps/services/sessions/src`,
      }),
    ],
    external: [
      ...(external || []),
      '@nestjs/websockets/socket-module',
      '@nestjs/microservices',
      'class-transformer',
      //'fsevents',
    ],

    // Allows for app specific overrides
    ...rest,
  }
}

module.exports = esbuildConfig
