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

const tsconfigBase = require('../tsconfig.base.json')
const tsconfigShared = require('../tsconfig.shared.json')

require('ts-node').register({
  compilerOptions: {
    ...tsconfigShared.compilerOptions,
    module: 'commonjs',
  },
  transpileOnly: true,
})
require('tsconfig-paths').register({
  baseUrl: tsconfigShared.compilerOptions.baseUrl,
  paths: tsconfigBase.compilerOptions.paths,
})
