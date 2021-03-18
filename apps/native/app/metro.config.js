const { appRootPath } = require("@nrwl/workspace/src/utils/app-root");
const { resolveRequest } = require('./metro.resolver');

module.exports = {
  projectRoot: appRootPath,
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
