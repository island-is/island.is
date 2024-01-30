/* eslint-disable */
export default {
  displayName: 'clients-university-application-university-of-akureyri',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/clients/university-application/university-of-akureyri',
}
