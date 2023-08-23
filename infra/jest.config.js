module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'esbuild-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  displayName: 'Config DSL',
}
