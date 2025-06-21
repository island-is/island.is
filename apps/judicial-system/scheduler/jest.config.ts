/* eslint-disable */
export default {
  displayName: 'judicial-system-scheduler',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globals: {},
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: `${__dirname}/tsconfig.spec.json`, isolatedModules: true },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/apps/judicial-system/scheduler',
  testEnvironment: 'node',
  detectLeaks: false,
}
