module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/api',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'api',
  testEnvironment: 'node',
}
