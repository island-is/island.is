// Set up ts-node and tsconfig-paths so nx libraries can be imported from JavaScript
// Usage:
//   * From JS files:
//
//      require('./path/to/ts-node')
//      const lib = require('@island.is/lib')
//
//   * From CLI:
//
//      yarn ts-node

const tsconfig = require('../tsconfig.base.json')

require('ts-node').register({
  compilerOptions: {
    ...tsconfig.compilerOptions,
    module: 'commonjs',
  },
  transpileOnly: true,
})
require('tsconfig-paths').register({
  baseUrl: tsconfig.compilerOptions.baseUrl,
  paths: tsconfig.compilerOptions.paths,
})
