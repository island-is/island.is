module.exports = {
  displayName:
    'application-templates-social-insurance-administration-additional-support-for-the-elderly',
  preset: './jest.preset.js',
  rootDir: '../../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { presets: ['@nx/react/babel'] }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/social-insurance-administration/additional-support-for-the-elderly',
}
