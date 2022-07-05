module.exports = {
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/reference-backend',
  globalSetup: './test/globalSetup.ts',
  globalTeardown: './test/globalTeardown.ts',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  displayName: 'services-auth-api',
  testEnvironment: 'node',
}
