const { withNxMetro } = require('@nx/react-native')
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const finalConfig = withNxMetro(config, {
  // Change this to true to see debugging info.
  // Useful if you have issues resolving modules
  debug: false,
  // all the file extensions used for imports other than 'ts', 'tsx', 'js', 'jsx', 'json'
  extensions: [],
  // Specify folders to watch, in addition to Nx defaults (workspace libraries and node_modules)
  watchFolders: [],
});

/**
 * Support for ${configDir} in tsconfig paths.
 * Need to patch "node_modules/@nx/react-native/plugins/metro-resolver.js"
 *
 * const configDirAbs = path.dirname(result.configFileAbsolutePath);
 * const configDir = path.relative(devkit.workspaceRoot, configDirAbs);
 * paths = Object.entries(result.paths).reduce((acc, [key, value]) => {
 *   acc[key] = value.map((p) => p.replace('${configDir}', configDir));
 *   return acc;
 * }, {});
 */


module.exports = finalConfig;
