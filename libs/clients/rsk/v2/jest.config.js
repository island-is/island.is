module.exports = {
  preset: '../../../../jest.preset.js',
  globals: {
    'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  testEnvironment: 'jest-environment-node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../../coverage/libs/clients/rsk/v2',
  displayName: 'rsk-v2',
}
