module.exports = {
  displayName: 'application-templates-directorate-of-equality-salary-report',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        presets: ['@nx/react/babel'],
        // Stamps the file scope vanilla-extract's `style()` reads at call time.
        // Without it any spec that renders an island-ui component dies on
        // import, because every `.css.ts` in the package throws.
        plugins: ['@vanilla-extract/babel-plugin'],
      },
    ],
  },
  setupFilesAfterEnv: [`${__dirname}/jest.setup.ts`],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/application/templates/directorate-of-equality/salary-report',
}
