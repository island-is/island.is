/* eslint-disable */
export default {
  displayName: 'clients-careers-holar-university',
  preset: '../../../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../../../coverage/libs/clients/university-careers/src/lib/clients/holar-university',
}
