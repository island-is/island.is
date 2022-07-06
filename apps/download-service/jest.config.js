module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/apps/download-service',
  setupFiles: [],
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  displayName: 'download-service',
  testEnvironment: 'node',
}
