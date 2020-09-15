module.exports = {
  name: 'island-ui-core',
  preset: '../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/island-ui/core',
  setupFilesAfterEnv: ['./jest.setup.ts'],
}
