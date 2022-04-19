const path = require('path')

module.exports = {
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  moduleNameMapper: {
    '^@island.is/skilavottord-web/(.*)$': path.resolve(__dirname),
  },
  coverageDirectory: '../../../coverage/apps/skilavottord/web',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'skilavottord-web',
  testEnvironment: 'node',
}
