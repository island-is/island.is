/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/auth/admin-api',
  globals: {},
  testTimeout: 10000,
  displayName: 'services-auth-admin-api',
  testEnvironment: 'node',
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
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
