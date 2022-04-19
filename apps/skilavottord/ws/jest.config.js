module.exports = {
  preset: '../../../jest.preset.js',
  globalSetup: './test/globalSetup.ts',
  globalTeardown: './test/globalTeardown.ts',
  coverageDirectory: '../../../coverage/apps/skilavottord/ws',
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'skilavottord-ws',
  testEnvironment: 'node',
}
