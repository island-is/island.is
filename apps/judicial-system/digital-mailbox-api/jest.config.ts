/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globals: {},
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '<rootDir>/coverage/apps/judicial-system/digital-mailbox-api',
  displayName: 'judicial-system-digital-mailbox-api',
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
