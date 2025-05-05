/* eslint-disable */
export default {
  displayName: 'training-license-on-a-work-machine',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/application/templates/aosh/training-license-on-a-work-machine',
}
