module.exports = {
  transform: {
    '^.+\\.[tj]sx?$': 'esbuild-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  coverageDirectory: '../coverage/infra',
  displayName: 'Config DSL',
}
