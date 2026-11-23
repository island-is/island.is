export default {
  displayName: 'employment-certificate',
  preset: '../../../../../jest.preset.js',
  transform: {
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '@nx/react/plugins/jest',
    '^.+\\.[tj]sx?$': [
      'babel-jest',
      {
        presets: ['@nx/react/babel'],
        // Gives island-ui's `.css.ts` files the file scope vanilla-extract
        // needs, so specs can render island-ui components.
        plugins: ['@vanilla-extract/babel-plugin'],
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  coverageDirectory:
    '../../../../../coverage/libs/application/templates/fjs/employment-certificate',
}
