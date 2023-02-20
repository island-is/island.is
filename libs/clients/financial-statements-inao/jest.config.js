module.exports = {
  displayName: 'clients-financial-statements-inao',
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.spec.json`,
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory:
    '<rootDir>/coverage/libs/clients/financial-statements-inao',
}
