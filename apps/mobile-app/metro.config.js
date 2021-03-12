const { withNxMetro } = require('@nrwl/react-native')
module.exports = withNxMetro(
  {
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  },
  {
    // Change this to true to see debugging info.
    // Useful if you have issues resolving modules
    debug: false,
  },
)
