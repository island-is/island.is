module.exports = {
  displayName: 'icelandic-names-registry-backend',
  preset: '../../../jest.preset.js',
  setupFiles: ['./test/environment.jest.ts'],
  setupFilesAfterEnv: ['./test/setup.ts'],
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '../../../coverage/apps/icelandic-names-registry/backend',
  testEnvironment: 'node',
}
