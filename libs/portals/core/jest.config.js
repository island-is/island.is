module.exports = {
  displayName: 'portals-core',
  testEnvironment: 'jsdom',
  preset: '../../../jest.preset.js',
  transform: {
    '\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  setupFilesAfterEnv: ['./test/setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../../coverage/libs/portals/core',
}
