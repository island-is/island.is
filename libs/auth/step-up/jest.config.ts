/* eslint-disable */
module.exports = {
  displayName: 'auth-step-up',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  testEnvironment: 'node',
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/auth/step-up',
}
