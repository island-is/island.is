module.exports = {
  name: 'judicial-system-web',
  preset: '../../../jest.config.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../coverage/apps/judicial-system/web',
  globals: { 'ts-jest': { tsConfig: '<rootDir>/tsconfig.spec.json' } },
}
