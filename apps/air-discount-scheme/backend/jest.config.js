module.exports = {
  name: 'air-discount-scheme-backend',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/air-discount-scheme/backend',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json',
    },
  },
}
