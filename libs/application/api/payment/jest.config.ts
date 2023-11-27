/* eslint-disable */
export default {
  displayName: 'application-api-payment',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
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
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/application/api/payment',
}
