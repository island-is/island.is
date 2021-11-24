module.exports = {
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/gjafakort-application',
  setupFilesAfterEnv: ['./test/setup.ts'],
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'gjafakort-application',
}
