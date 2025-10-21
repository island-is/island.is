/* eslint-disable */
export default {
  displayName: 'application-templates-european-health-insurance-card',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/application/templates/iceland-health/european-health-insurance-card',
}
