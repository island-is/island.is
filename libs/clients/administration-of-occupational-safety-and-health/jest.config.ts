/* eslint-disable */
export default {
  displayName: 'clients-administration-of-occupational-safety-and-health',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/libs/clients/administration-of-occupational-safety-and-health',
}
