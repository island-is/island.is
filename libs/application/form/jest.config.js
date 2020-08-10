module.exports = {
  name: 'application-form',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
    '^.+\\.svg$': 'jest-transform-stub',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/application/form',
  setupFilesAfterEnv: ['./jest.setup.ts'],
}
