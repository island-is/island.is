/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/message-queue',
  globals: {},
  displayName: 'message-queue',
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  testEnvironment: 'node',
}
