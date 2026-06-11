/* eslint-disable */
export default {
  displayName: 'sdf-unit-tests',
  preset: './jest.preset.js',
  rootDir: '../../../../../../..',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': [
      'ts-jest',
      {
        tsconfig: '<rootDir>/apps/application-system/api/tsconfig.spec.json',
        isolatedModules: true,
      },
    ],
  },
  testMatch: [
    '<rootDir>/apps/application-system/api/src/app/modules/sdf/**/*.spec.ts',
  ],
  moduleFileExtensions: ['ts', 'js', 'html', 'json'],
}
