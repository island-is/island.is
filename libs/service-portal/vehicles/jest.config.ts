/* eslint-disable */
export default {
  displayName: 'service-portal-vehicles',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/service-portal/vehicles',
}
