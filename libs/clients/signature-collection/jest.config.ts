/* eslint-disable */
export default {
  displayName: 'clients-signature-collection',
  preset: '../../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  coverageDirectory: '<rootDir>/coverage/libs/clients/signature-collection',
}
