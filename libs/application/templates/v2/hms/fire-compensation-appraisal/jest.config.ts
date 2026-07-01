/* eslint-disable */
export default {
  displayName: 'fire-compensation-appraisal-sdf',
  preset: '../../../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../../coverage/libs/application/templates/v2/hms/fire-compensation-appraisal',
}
