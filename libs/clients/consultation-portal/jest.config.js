module.exports = {
  displayName: 'clients-consultation-portal',

  preset: './jest.preset.js',
  rootDir: '../../..',

  globals: {
    'ts-jest': {
      tsconfig: `${__dirname}/tsconfig.spec.json`,
    },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  roots: [__dirname],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '<rootDir>/coverage/libs/clients/consultation-portal',
}
