/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/financial-aid/backend',
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {},
  displayName: 'financial-aid-backend',
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
