module.exports = {
  displayName: 'services-endorsements-api',
  preset: '../../../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '../../../../coverage/apps/services/endorsements/api',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  globalSetup: './test/globalSetup.ts',
  globalTeardown: './test/globalTeardown.ts',
  testEnvironment: 'node',
}
