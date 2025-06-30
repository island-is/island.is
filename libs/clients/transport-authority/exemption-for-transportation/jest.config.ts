/* eslint-disable */
export default {
  displayName: 'clients-transport-authority-exemption-for-transportation',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/clients/transport-authority/exemption-for-transportation',
}
