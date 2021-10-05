module.exports = {
  displayName: 'services-auth-public-api',
  preset: '../../../jest.preset.js',
  globals: {
    'esbuild-jest': {
      diagnostics: false,
      tsConfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  transform: {
    '^.+\\.[tj]s$': 'esbuild-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  coverageDirectory: '../../../coverage/apps/services/auth-public-api',
  setupFilesAfterEnv: ['./test/setup.ts'],
}
