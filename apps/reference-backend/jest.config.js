module.exports = {
  name: 'reference-backend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/reference-backend',
  testMatch: ['**/test/**/+(*.)+(spec|test).+(ts|js)?(x)'],
  setupFilesAfterEnv: ['./test/setup.ts'],
}
