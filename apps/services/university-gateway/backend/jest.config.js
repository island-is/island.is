module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/university-gateway/backend',
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  displayName: 'university-gateway-backend',
  testEnvironment: 'node',
}
