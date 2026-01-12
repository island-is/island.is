/* eslint-disable */
export default {
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  transform: {
    '^.+\\.[tj]sx?$': [
      'ts-jest',
      {
        cwd: __dirname,
        tsConfig: `${__dirname}/tsconfig.spec.json`,
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '<rootDir>/coverage/libs/application/templates/inheritance-report',
  displayName: 'application-templates-inheritance-report',
}
