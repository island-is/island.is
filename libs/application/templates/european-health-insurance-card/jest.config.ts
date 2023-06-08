/* eslint-disable */
export default {
  displayName: 'application-templates-european-health-insurance-card',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/european-health-insurance-card',
}
