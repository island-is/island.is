module.exports = {
  coverageDirectory: '<rootDir>/coverage/<project>',
  displayName: 'Config DSL',
  // globals: {},
  // moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  preset: '../jest.preset.js',
  // rootDir: '../../..',
  // roots: [__dirname],
  testEnvironment: 'node',
  // // transform: { '^.+\\.[tj]sx?$': 'esbuild-jest', },
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json` },
    ],
  },
}
