module.exports = {
  displayName: 'auth-react',
  preset: '../../../jest.preset.js',
  setupFilesAfterEnv: ['./test/setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/auth/react',
}
