/* eslint-disable */
export default {
  displayName: 'application-templates-directorate-of-immigration-citizenship',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/application/templates/directorate-of-immigration/citizenship',
}
