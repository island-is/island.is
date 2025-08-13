/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../',
  roots: [__dirname],
  detectLeaks: false,
  coverageDirectory: '<rootDir>/coverage/apps/services/payments',
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  setupFiles: [`${__dirname}/test/environment.ts`],
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {},
  displayName: 'services-payments',
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
