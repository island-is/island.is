module.exports = {
  preset: '../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/api/domains/air-discount-scheme',
  displayName: 'api-domains-air-discount-scheme',
  testEnvironment: 'node',
}
