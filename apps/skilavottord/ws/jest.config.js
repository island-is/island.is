module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  coverageDirectory: '<rootDir>/coverage/apps/skilavottord/ws',
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'skilavottord-ws',
  testEnvironment: 'node',
}
