const { appRootPath } = require("@nrwl/workspace/src/utils/app-root");
const { resolveRequest } = require('./metro.resolver');

module.exports = (async () => {
  return {
    projectRoot: appRootPath,
    watchFolders: [appRootPath],
    resolver: {
      resolveRequest,
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  };
})();
