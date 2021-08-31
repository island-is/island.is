module.exports = {
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/air-discount-scheme/api',
  setupFiles: ['./test/environment.jest.ts'],
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'air-discount-scheme-api',
  testEnvironment: 'node',
}
