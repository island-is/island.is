/* eslint-disable */
export default {
  displayName: 'clients-careers-agricultural-university-of-iceland',
  preset: '../../../../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../../../../coverage/libs/clients/university-careers/src/lib/clients/agricultural-university-of-iceland',
}
