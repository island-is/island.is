/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/portals/my-pages/core',
  globals: {},
  displayName: 'portals-my-pages-core',
}
