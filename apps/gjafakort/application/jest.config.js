module.exports = {
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/gjafakort-application',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'gjafakort-application',
  testEnvironment: 'node',
}
