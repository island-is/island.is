module.exports = {
  displayName: 'application-templates-no-debt-certificate',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.spec.json`,
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  testEnvironment: 'node',
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/no-debt-certificate',
}
