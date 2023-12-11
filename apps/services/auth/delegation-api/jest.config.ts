/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/auth/delegation-api',
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
  //setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {},
  displayName: 'services-auth-delegation-api',
  testTimeout: 10000,
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: `${__dirname}/tsconfig.spec.json`,
        isolatedModules: true,
      },
    ],
  },
}
