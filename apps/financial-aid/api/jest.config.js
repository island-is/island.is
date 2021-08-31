module.exports = {
  preset: '../../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../../coverage/apps/financial-aid/api',
  displayName: 'financial-aid-api',
  testEnvironment: 'node',
}
