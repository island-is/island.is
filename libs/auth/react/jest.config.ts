/* eslint-disable */
export default {
  displayName: 'auth-react',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/auth/react',
}
