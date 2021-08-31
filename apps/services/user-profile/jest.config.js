module.exports = {
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/services/user-profile/api',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  displayName: 'services-user-profile',
  testEnvironment: 'node',
}
