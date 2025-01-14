module.exports = {
  displayName: 'portals-my-pages-signature-collection',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/portals/my-pages/signature-collection',
}
