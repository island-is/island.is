module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/air-discount-scheme/api',
  setupFiles: [`${__dirname}/test/environment.jest.ts`],
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'air-discount-scheme-api',
  testEnvironment: 'node',
}
