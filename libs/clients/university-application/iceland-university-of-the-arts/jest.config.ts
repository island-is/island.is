/* eslint-disable */
export default {
  displayName: 'clients-university-application-iceland-university-of-the-arts',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/clients/university-application/iceland-university-of-the-arts',
}
