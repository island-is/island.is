module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory:
    '../../../coverage/libs/icelandic-names-registry-types/types',
  globals: { 'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` } },
  displayName: 'icelandic-names-registry-types',
}
