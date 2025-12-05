/* eslint-disable */
const path = require('path')
export default {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: `${__dirname}/tsconfig.spec.json`,
        isolatedModules: true,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  moduleNameMapper: {
    '^@island.is/skilavottord-web/(.*)$': path.resolve(__dirname),
  },
  coverageDirectory: '<rootDir>/coverage/apps/skilavottord/web',
  globals: {},
  displayName: 'skilavottord-web',
}
