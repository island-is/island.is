module.exports = {
  displayName: 'samradsgatt',
  preset: '../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nrwl/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        cwd: __dirname,
        configFile: './babel-jest.config.json',
        presets: ['@nrwl/next/babel'],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/samradsgatt',
}
