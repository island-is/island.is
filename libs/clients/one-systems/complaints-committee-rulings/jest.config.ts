/* eslint-disable */
module.exports = {
  displayName: 'clients-one-systems-complaints-committee-rulings',
  preset: '../../../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '../../../../coverage/libs/clients/one-systems/complaints-committee-rulings',
}
