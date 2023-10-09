/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  coverageDirectory: '<rootDir>/coverage/apps/services/search-indexer',
  globals: {},
  displayName: 'services-search-indexer',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: `${__dirname}/tsconfig.spec.json`,
        isolatedModules: true,
      },
    ],
  },
}
