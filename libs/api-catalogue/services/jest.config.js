module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/api-catalogue/services',
  displayName: 'api-catalogue-services',
}
