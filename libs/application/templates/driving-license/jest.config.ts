/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/driving-license',
  displayName: 'application-templates-driving-license',
}
