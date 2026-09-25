const { pathsToModuleNameMapper } = require('ts-jest')
// Test configuration needs the workspace alias map, not an application dependency.
// eslint-disable-next-line @nx/enforce-module-boundaries
const { compilerOptions } = require('../../../../tsconfig.base.json')

// Pure collector tests: no Docker, databases, SQS or service secrets required.
module.exports = {
  displayName: 'notification-metrics',
  rootDir: '../../../..',
  preset: './jest.preset.js',
  testEnvironment: 'node',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
  testMatch: [
    '<rootDir>/libs/infra-metrics/src/lib/snapshot.spec.ts',
    '<rootDir>/libs/infra-nest-server/src/lib/processJob.spec.ts',
    '<rootDir>/apps/services/user-profile/src/metrics/*.spec.ts',
    '<rootDir>/apps/services/user-notification/src/metrics/*.spec.ts',
    '<rootDir>/apps/services/user-notification/metrics/*.spec.ts',
    '<rootDir>/infra/src/dsl/notification-metrics.spec.ts',
  ],
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig:
          '<rootDir>/apps/services/user-notification/tsconfig.spec.json',
        isolatedModules: true,
      },
    ],
  },
}
