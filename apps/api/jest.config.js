module.exports = {
  preset: './jest.preset.js',
  coverageDirectory: '<rootDir>/coverage/apps/api',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/apps/api/tsconfig.spec.json' } },
  displayName: 'api',
  testEnvironment: 'node',
  rootDir: '/Users/petar/src/andes/customers/si/island.is',
  roots: ['<rootDir>/apps/api'],
  coverageReporters: ['json', ['lcov', {'projectRoot': "/"}]],
}
