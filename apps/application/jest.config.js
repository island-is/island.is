module.exports = {
  name: 'application',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/application',
  setupFilesAfterEnv: ['./test/setup.ts'],
}
