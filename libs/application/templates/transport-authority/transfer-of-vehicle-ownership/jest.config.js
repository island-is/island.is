module.exports = {
  displayName:
    'application-templates-transport-authority-transfer-of-vehicle-ownership',
  preset: './jest.preset.js',
  rootDir: '../../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/transport-authority/transfer-of-vehicle-ownership',
}
