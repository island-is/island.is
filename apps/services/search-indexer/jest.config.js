module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/search-indexer',
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'services-search-indexer',
  testEnvironment: 'node',
}
