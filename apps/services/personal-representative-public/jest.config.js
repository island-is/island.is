module.exports = {
  displayName: 'services-personal-representative-public',
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
  coverageDirectory:
    '../../../coverage/apps/services/personal-representative-public',
  setupFiles: ['./test/environment.jest.ts'],
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
