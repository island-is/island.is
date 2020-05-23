module.exports = {
  name: 'reference-backend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/reference-backend',
  setupFilesAfterEnv: ['./test/setup.ts'],
}
