/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
  coverageDirectory: '<rootDir>/coverage/libs/api/domains/communications',
  displayName: 'api-domains-communications',
  testEnvironment: 'node',
}
