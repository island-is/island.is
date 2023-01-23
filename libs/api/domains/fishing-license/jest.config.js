module.exports = {
  displayName: 'api-domains-fishing-license',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.spec.json`,
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/api/domains/fishing-license',
  testEnvironment: 'node',
}
