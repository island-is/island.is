/* eslint-disable */
export default {
  displayName: 'application-templates-no-debt-certificate',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/no-debt-certificate',
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
