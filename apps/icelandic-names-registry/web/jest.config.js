module.exports = {
  preset: '../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/apps/icelandic-names-registry/web',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
  displayName: 'icelandic-names-registry-web',
}
