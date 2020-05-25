module.exports = {
  name: 'gjafakort-application',
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/gjafakort-application',
  setupFilesAfterEnv: ['./test/setup.ts'],
}
