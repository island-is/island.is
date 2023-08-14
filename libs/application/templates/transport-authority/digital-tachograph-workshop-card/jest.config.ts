/* eslint-disable */
export default {
  displayName:
    'application-templates-transport-authority-digital-tachograph-workshop-card',
  preset: './jest.preset.js',
  rootDir: '../../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/transport-authority/digital-tachograph-workshop-card',
}
