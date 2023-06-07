module.exports = {
  displayName: 'clients-rsk-procuring',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/clients/rsk/procuring',
}
