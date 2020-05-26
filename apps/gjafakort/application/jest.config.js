module.exports = {
  name: 'gjafakort-application',
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/gjafakort-application',
  setupFiles: ['./src/environments/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
}
