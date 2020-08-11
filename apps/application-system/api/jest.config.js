module.exports = {
  name: 'application-system-api',
  preset: '../../../jest.config.js',
  coverageDirectory: '../../../coverage/apps/application-system/api',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.spec.json',
    },
  },
}
