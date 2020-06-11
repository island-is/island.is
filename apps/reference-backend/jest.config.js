module.exports = {
  name: 'reference-backend',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/reference-backend',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
}
