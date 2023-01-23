module.exports = {
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/next-ids-auth',
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'auth-api-lib',
}
