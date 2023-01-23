module.exports = {
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/content-search-toolkit',
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'content-search-toolkit',
}
