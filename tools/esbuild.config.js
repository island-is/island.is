// TODO: Where should this file live?
const { esbuildDecorators } = require('@anatine/esbuild-decorators')
const svgrPlugin = require('esbuild-plugin-svgr')

module.exports = {
  keepNames: true,
  plugins: [
    // Add eslint plugin for basic emitDecoratorMetadata support.
    // This is required by many features in NestJS.
    esbuildDecorators(),
    // Add SVG plugin for React components
    svgrPlugin({
      // Configure for both static and dynamic imports
      typescript: true,
      // Handle both default exports and named exports
      exportType: 'default',
    }),
  ],
}
