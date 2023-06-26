module.exports = {
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/api',
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'api',
  testEnvironment: 'node',
}
