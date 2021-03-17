const app_root_1 = require("@nrwl/workspace/src/utils/app-root");
// const x = require('metro-resolver');
// const resolve = require('metro-resolver/src/resolve');
const { resolveRequest } = require('./metro.resolver');
module.exports = {
  projectRoot: app_root_1.appRootPath,
  resolver: {
    resolveRequest,
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

// const { withNxMetro } = require('@nrwl/react-native');
// module.exports = withNxMetro({
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: false,
//       },
//     }),
//   },
// }, {
//   // Change this to true to see debugging info.
//   // Useful if you have issues resolving modules
//   debug: false
// });
