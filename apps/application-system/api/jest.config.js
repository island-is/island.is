module.exports = {
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/application-system/api',
  globalSetup: './test/globalSetup.ts',
  globalTeardown: './test/globalTeardown.ts',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  displayName: 'application-system-api',
  testEnvironment: 'node',
}
