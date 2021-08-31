module.exports = {
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/application-system/api',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  displayName: 'application-system-api',
  testEnvironment: 'node',
}
