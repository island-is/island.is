// TODO: Where should this file live?
const { esbuildDecorators } = require('@anatine/esbuild-decorators')

module.exports = {
  plugins: [
    // Add eslint plugin for basic emitDecoratorMetadata support.
    // This is required by many features in NestJS.
    esbuildDecorators()
  ]
}
