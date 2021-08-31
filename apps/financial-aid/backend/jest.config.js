module.exports = {
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/financial-aid/backend',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  displayName: 'financial-aid-backend',
  testEnvironment: 'node',
}
