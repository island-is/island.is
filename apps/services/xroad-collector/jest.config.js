module.exports = {
  preset: `${__dirname}/jest.preset.js`,
  rootDir: '../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/xroad-collector',
  displayName: 'services-xroad-collector',
  testEnvironment: 'node',
}
