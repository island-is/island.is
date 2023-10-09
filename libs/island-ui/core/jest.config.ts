/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  transform: {
    '\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/island-ui/core',
  setupFilesAfterEnv: [`${__dirname}/jest.setup.ts`],
  displayName: 'island-ui-core',
}
