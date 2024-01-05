/* eslint-disable */
export default {
  displayName: 'services-endorsements-api',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json`, isolatedModules: true },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  testEnvironment: 'jest-environment-node',
  coverageDirectory: '<rootDir>/coverage/apps/services/endorsements/api',
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
}
