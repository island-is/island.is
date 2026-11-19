module.exports = {
  preset: './jest.preset.js',
  rootDir: '../../..',
  roots: [__dirname],
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    // Specs here load real application templates. ts-jest with type-checking
    // runs out of memory on that dependency graph, so transpile with babel.
    // The vanilla-extract plugin stamps the file scope `style()` needs, since
    // the templates' field components import `.css.ts` files.
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        presets: ['@nx/react/babel'],
        plugins: ['@vanilla-extract/babel-plugin'],
      },
    ],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '<rootDir>/coverage/libs/application/template-loader',
  displayName: 'application-template-loader',
}
