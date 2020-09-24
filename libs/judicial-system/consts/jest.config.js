module.exports = {
  name: 'judicial-system-consts',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/judicial-system/consts',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
}
