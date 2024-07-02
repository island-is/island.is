/* eslint-disable */
export default {
  displayName: 'clients-ums-cost-of-living-calculator',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/libs/clients/ums-cost-of-living-calculator',
}
