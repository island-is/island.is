module.exports = {
  displayName: 'services-auth-delegation-api',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
  testTimeout: 10000,
  testEnvironment: 'node',
  // Test files must not run in parallel. Every `setupWithAuth` call runs
  // `sequelize.sync({ force: true })` (see libs/testing/nest useDatabase), which
  // drops and recreates every table in the single shared `test_db`. With
  // parallel workers one file wipes the schema out from under another mid-test,
  // which shows up as unrelated tests failing at random.
  maxWorkers: 1,
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: `${__dirname}/tsconfig.spec.json`,
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/apps/services/auth/delegation-api',
}
