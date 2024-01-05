/* eslint-disable */
export default {
  displayName: 'icelandic-names-registry-backend',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globalSetup: `${__dirname}/test/globalSetup.ts`,
  globalTeardown: `${__dirname}/test/globalTeardown.ts`,
  setupFilesAfterEnv: [`${__dirname}/test/setup.ts`],
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json`, isolatedModules: true },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '<rootDir>/coverage/apps/icelandic-names-registry/backend',
  testEnvironment: 'node',
}
