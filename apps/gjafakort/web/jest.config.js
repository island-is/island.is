const path = require('path')

module.exports = {
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  moduleNameMapper: {
    '^@island.is/gjafakort-web/(.*)$': path.resolve(__dirname),
  },
  coverageDirectory: '../../../coverage/apps/gjafakort/web',
  setupFiles: ['./jest.setup.js'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'gjafakort-web',
  testEnvironment: 'node',
}
