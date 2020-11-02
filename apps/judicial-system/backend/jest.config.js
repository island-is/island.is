module.exports = {
  name: 'judicial-system-backend',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/judicial-system/backend',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
}
