/* eslint-disable */
export default {
  displayName: 'clients-icelandic-government-institution-vacancies-v2',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../coverage/libs/clients/icelandic-government-institution-vacancies-v2',
}
