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

require('ts-node').register({
  compilerOptions: { module: 'commonjs', esModuleInterop: true },
})
require('tsconfig-paths').register()
