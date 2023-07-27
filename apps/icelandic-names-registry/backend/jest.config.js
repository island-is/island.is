module.exports = {
  displayName: 'icelandic-names-registry-backend',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '<rootDir>/coverage/apps/icelandic-names-registry/backend',
  testEnvironment: 'node',
}
