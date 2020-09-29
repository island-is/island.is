module.exports = {
  name: 'file-storage',
  preset: '../../jest.config.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../coverage/libs/file-storage',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
}
