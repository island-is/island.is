module.exports = {
  displayName: 'github-actions-cache',
  preset: `${__dirname}/jest.preset.js`,
  rootDir: '../..',
  roots: [__dirname],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/apps/github-actions-cache',
  testEnvironment: 'node',
}
