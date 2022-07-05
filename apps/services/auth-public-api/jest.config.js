module.exports = {
  displayName: 'services-auth-public-api',
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': {
      diagnostics: false,
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '../../../coverage/apps/services/auth-public-api',
  setupFilesAfterEnv: ['./test/setup.ts'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!**/*.css.*',
    '!**/*.config.*',
    '!**/infra/*',
    '!**/seeders/*',
    '!**/migration/*',
    '!**/main.ts',
    '!**/buildOpenApi.ts',
    '!**/openApi.ts',
  ],
  testEnvironment: 'node',
}
