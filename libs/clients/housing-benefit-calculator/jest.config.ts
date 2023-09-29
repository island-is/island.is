/* eslint-disable */
export default {
  displayName: 'clients-housing-benefit-calculator',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      { tsconfig: '<rootDir>/tsconfig.spec.json', isolatedModules: true },
    ],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/libs/clients/housing-benefit-calculator',
}
