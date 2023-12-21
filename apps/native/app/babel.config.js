module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@ui': './src/ui',
          '@island.is/application/types': '../../../libs/application/types/src',
        },
      },
    ],
  ],
}
