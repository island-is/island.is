/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {},
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/api/domains/national-registry-x-road',
  displayName: 'api-domains-national-registry-x-road',
}
