module.exports = {
  presets: ['module:@react-native/babel-preset'],
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
    // react-native-reanimated/plugin has to be listed last.
    // Reason: In short, the Reanimated babel plugin automatically converts special JavaScript functions (called worklets) to allow them to be passed and run on the UI thread.
    'react-native-reanimated/plugin',
  ],
}
