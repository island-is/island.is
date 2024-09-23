/* eslint-disable */
export default {
  displayName: 'application-templates-financial-statment-individual-election',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: `${__dirname}/babel-jest.config.json` },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../coverage/libs/application/templates/inao/financial-statement-individual-election',
}
