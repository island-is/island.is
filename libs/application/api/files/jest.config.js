module.exports = {
  displayName: 'application-api-files',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.spec.json`,
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/application/api/files',
}
