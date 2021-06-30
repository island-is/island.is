module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'formatjs',
      {
        idInterpolationPattern: '[sha512:contenthash:base64:6]',
        ast: true,
      },
    ],
  ],
}
