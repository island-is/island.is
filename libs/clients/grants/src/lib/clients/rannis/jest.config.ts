/* eslint-disable */
export default {
  displayName: 'client-rannis',
  preset: '../../../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../../../coverage/libs/clients/grants/src/lib/clients/rannis',
}
