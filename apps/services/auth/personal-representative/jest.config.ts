/* eslint-disable */
export default {
  displayName: 'services-auth-personal-representative',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        diagnostics: false,
        tsconfig: `${__dirname}/tsconfig.spec.json`,
        isolatedModules: true,
      },
    ],
  },
  testTimeout: 10000,
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory:
    '<rootDir>/coverage/apps/services/auth/personal-representative',
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
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
