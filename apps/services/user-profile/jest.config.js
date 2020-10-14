module.exports = {
  name: 'services-user-profile',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/services/user-profile/api',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
}
