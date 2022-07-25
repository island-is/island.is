module.exports = {
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/services/search-indexer',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'services-search-indexer',
  testEnvironment: 'node',
}
