/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        cwd: __dirname,
        configFile: `${__dirname}/babel-jest.config.json`,
        tsConfig: `${__dirname}/tsconfig-spec.json`,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/inheritance-report',
  displayName: 'application-templates-inheritance-report',
}
