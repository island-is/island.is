/* eslint-disable */
export default {
  displayName: 'clients-directorate-of-immigration-residence-permit',
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
    '../../../../coverage/libs/clients/directorate-of-immigration/residence-permit',
}
