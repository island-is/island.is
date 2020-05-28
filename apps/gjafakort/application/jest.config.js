module.exports = {
  name: 'gjafakort-application',
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/gjafakort-application',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
}
