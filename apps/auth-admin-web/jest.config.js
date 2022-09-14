module.exports = {
  preset: '../../jest.preset.js',
  globals: { fetch, Response, Request },
  transform: {
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      { cwd: __dirname, configFile: './babel-jest.config.json' },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory: '../../coverage/apps/auth-admin-web',
  displayName: 'auth-admin-web',
}
