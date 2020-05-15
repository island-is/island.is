module.exports = {
  name: 'application',
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/application',
  setupFilesAfterEnv: ['./test/setup.ts'],
}
