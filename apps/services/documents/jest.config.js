module.exports = {
  name: 'services-documents',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/services/documents',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
}
