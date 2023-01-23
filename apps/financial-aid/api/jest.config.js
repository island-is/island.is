module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '<rootDir>/coverage/apps/financial-aid/api',
  displayName: 'financial-aid-api',
  testEnvironment: 'node',
}
