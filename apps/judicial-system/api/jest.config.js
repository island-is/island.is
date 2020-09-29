module.exports = {
  name: 'judicial-system-api',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/judicial-system/api',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
}
