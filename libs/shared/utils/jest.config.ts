/* eslint-disable */
export default {
  displayName: 'shared-utils',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  detectLeaks: false,
  globals: {},
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/shared/utils',
}
