/* eslint-disable */
export default {
  displayName: 'api-domains-directorate-of-immigration',
  preset: '../../../../jest.preset.js',
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: `${__dirname}/tsconfig.spec.json`,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/api/domains/directorate-of-immigration',
}
