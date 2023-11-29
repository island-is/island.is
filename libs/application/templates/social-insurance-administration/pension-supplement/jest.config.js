module.exports = {
  displayName:
    'application-templates-social-insurance-administration-pension-supplement',
  preset: './jest.preset.js',
  rootDir: '../../../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/social-insurance-administration/pension-supplement',
}
