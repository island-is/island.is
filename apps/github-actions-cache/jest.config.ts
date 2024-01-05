/* eslint-disable */
export default {
  displayName: 'github-actions-cache',
  preset: './jest.preset.js',
  rootDir: '../..',
  roots: [__dirname],
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json`, isolatedModules: true },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/apps/github-actions-cache',
  testEnvironment: 'node',
}
