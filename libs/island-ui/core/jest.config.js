module.exports = {
  preset: '../../../jest.preset.js',
  transform: {
    '\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/libs/island-ui/core',
  setupFilesAfterEnv: ['./jest.setup.ts'],
  displayName: 'island-ui-core',
}
