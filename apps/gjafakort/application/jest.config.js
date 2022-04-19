module.exports = {
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: '../../../jest.preset.js',
  globalSetup: './test/globalSetup.ts',
  globalTeardown: './test/globalTeardown.ts',
  coverageDirectory: '../../../coverage/apps/gjafakort-application',
  setupFilesAfterEnv: ['./test/setup.ts'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'gjafakort-application',
  testEnvironment: 'node',
}
