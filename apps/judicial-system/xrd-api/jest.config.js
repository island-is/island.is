module.exports = {
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/judicial-system/xrd-api',
  displayName: 'judicial-system-xrd-api',
  testEnvironment: 'node',
}
