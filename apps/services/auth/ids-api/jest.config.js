module.exports = {
  preset: '../../../../jest.preset.js',
  coverageDirectory: '../../../../coverage/apps/services/auth/ids-api',
  globalSetup: './test/globalSetup.ts',
  globalTeardown: './test/globalTeardown.ts',
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  displayName: 'services-auth-ids-api',
  testEnvironment: 'node',
}
