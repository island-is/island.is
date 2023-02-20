module.exports = {
  displayName: 'auth-react',
  preset: './jest.preset.js',
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  rootDir: '../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/auth/react',
}
