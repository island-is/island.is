module.exports = {
  displayName: 'services-university-gateway-worker',
  preset: './jest.preset.js',
  rootDir: '../../../..',
  roots: [__dirname],
  globals: {
    'ts-jest': { tsconfig: `${__dirname}/tsconfig.spec.json` },
  },
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
  testEnvironment: 'node',
  coverageDirectory:
    '<rootDir>/coverage/apps/services/university-gateway/worker',
}
