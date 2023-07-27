module.exports = {
  displayName: 'clients-rsk-personal-tax-return',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  testEnvironment: 'node',
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/clients/rsk/personal-tax-return',
}
