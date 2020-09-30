module.exports = {
  name: 'application-ui-shell',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
    '^.+\\.svg$': 'jest-transform-stub',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/application/ui-shell',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
}
