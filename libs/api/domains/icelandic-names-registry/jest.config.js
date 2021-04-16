module.exports = {
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/api/domains/icelandic-names-registry',
  displayName: 'api-domains-icelandic-names-registry',
}
