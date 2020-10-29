module.exports = {
  name: 'services-auth-api',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/reference-backend',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
}
