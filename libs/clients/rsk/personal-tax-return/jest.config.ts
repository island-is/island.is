/* eslint-disable */
export default {
  displayName: 'clients-rsk-personal-tax-return',
  preset: './jest.preset.js',
  rootDir: '../../../..',
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
  coverageDirectory: '<rootDir>/coverage/libs/clients/rsk/personal-tax-return',
}
