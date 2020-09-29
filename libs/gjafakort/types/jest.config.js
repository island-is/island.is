module.exports = {
  name: 'gjafakort-types',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/gjafakort/types',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
}
