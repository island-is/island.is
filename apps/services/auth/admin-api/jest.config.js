module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/auth/admin-api',
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  displayName: 'services-auth-admin-api',
  testEnvironment: 'node',
}
