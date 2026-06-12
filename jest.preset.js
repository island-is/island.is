const path = require('path')
const nxPreset = require('@nx/jest/preset').default
const { transform, ...nxPresetRest } = nxPreset
const customResolver = path.join(__dirname, 'jest.resolver.js')

module.exports = {
  ...nxPresetRest,
  testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
  testPathIgnorePatterns: ['<rootDir>/apps/.*/e2e'],
  resolver: customResolver,
  testTimeout: 10000,
  detectOpenHandles: false,
  runInBand: false,
  detectLeaks: false,
  passWithNoTests: true,
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageReporters: ['json', 'lcov'],
  collectCoverageFrom: [
    '**/*.{js,jsx,ts,tsx}',
    '!src/**/*.css.*',
    '!src/**/*.config.*',
    '!src/**/*.d.ts',
    '!**/node_modules/**',
    '!**/dist/**',
    '!**/build/**',
    '!**/coverage/**',
    '!**/.next/**',
    '!**/out/**',
    '!**/infra/*',
    '!**/seeders/*',
    '!**/migrations/*',
  ],
  moduleNameMapper: {
    // Axios and Jest aren't best friends right now:
    // https://github.com/axios/axios/issues/5101
    '^axios$': require.resolve('axios'),
    // PDF viewer external css can be excluded from tests, otherwise will cause an error.
    '^react-pdf/dist/Page/(.*)$': 'jest-transform-stub',
  },
  /* TODO: Update to latest Jest snapshotFormat
   * By default Nx has kept the older style of Jest Snapshot formats
   * to prevent breaking of any existing tests with snapshots.
   * It's recommend you update to the latest format.
   * You can do this by removing snapshotFormat property
   * and running tests with --update-snapshot flag.
   * Example: "nx affected --targets=test,external-test --update-snapshot"
   * More info: https://jestjs.io/docs/upgrading-to-jest29#snapshot-format
   */
  snapshotFormat: { escapeString: true, printBasicPrototype: true },
}
