module.exports = {
  displayName: 'consultation-portal',
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        cwd: __dirname,
        configFile: `${__dirname}/babel-jest.config.json`,
        presets: ['@nrwl/next/babel'],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/apps/consultation-portal',
}
