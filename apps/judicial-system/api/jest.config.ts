/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globals: {},
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/apps/judicial-system/api',
  displayName: 'judicial-system-api',
  testEnvironment: 'node',
}
