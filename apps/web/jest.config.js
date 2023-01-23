module.exports = {
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/apps/web',
  displayName: 'web',
}
