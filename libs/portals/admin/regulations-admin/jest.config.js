module.exports = {
  displayName: 'portals-admin-regulations-admin',
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/portals/admin/regulations-admin',
}
