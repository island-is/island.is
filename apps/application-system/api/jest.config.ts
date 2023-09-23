import { workspaceRoot } from '@nx/devkit'

/* eslint-disable */
export default {
  preset: '../../../jest.preset.js',
  coverageDirectory: `${workspaceRoot}/coverage/apps/application-system/api`,
  globalSetup: '<rootDir>/test/globalSetup.ts',
  globalTeardown: '<rootDir>/test/globalTeardown.ts',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {},
  displayName: 'application-system-api',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['babel-jest'],
  },
}
