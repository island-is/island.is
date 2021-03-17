const resolve = require('metro-resolver/src/resolve');
const { createMatchPath, loadConfig } = require("tsconfig-paths");
const { fileExistsSync } = require('tsconfig-paths/lib/filesystem');
const chalk = require("chalk");
const path = require('path');

const DEBUG = true;
/*
 * Use tsconfig to resolve additional workspace libs.
 *
 * This resolve function requires projectRoot to be set to
 * workspace root in order modules and assets to be registered and watched.
 */
function resolveRequest(_context, realModuleName, platform, moduleName) {
    if (DEBUG)
        console.log(chalk.cyan(`[Nx] Resolving: ${moduleName}`));
    const { resolveRequest, ...context } = _context;
    try {
        return resolve(context, moduleName.replace(/\.js$/,''), platform, moduleName);
    }
    catch (_a) {
      console.log('err', _a);
        if (DEBUG)
            console.log(chalk.cyan(`[Nx] Unable to resolve with default Metro resolver: ${moduleName}`));
    }
    const matcher = getMatcher();
    const match = matcher(realModuleName);
    if (match) {
        return {
            type: 'sourceFile',
            filePath: match,
        };
    }
    else {
      // console.log({context, realModuleName, moduleName, platform});
      if (DEBUG) {
        console.log(chalk.red(`[Nx] Failed to resolve ${chalk.bold(moduleName)}`));
        console.log(chalk.cyan(`[Nx] The following tsconfig paths was used:\n:${chalk.bold(JSON.stringify(paths, null, 2))}`));
      }
        const newFilePath = path.join(path.dirname(context.originModulePath), realModuleName);
        const attemptedFilePath = path.join(path.dirname(context.originModulePath), realModuleName)

      if (fileExistsSync(attemptedFilePath+'.ts')) {
        return { type: 'sourceFile', filePath: attemptedFilePath+'.ts' };
      } else if (fileExistsSync(attemptedFilePath+'.tsx')) {
        return { type: 'sourceFile', filePath: attemptedFilePath+'.tsx' };
      } else if (fileExistsSync(attemptedFilePath+'.js')) {
        return { type: 'sourceFile', filePath: attemptedFilePath+'.js' };
      } else if (fileExistsSync(attemptedFilePath+'.jsx')) {
        return { type: 'sourceFile', filePath: attemptedFilePath+'.jsx' };
      } else if (fileExistsSync(attemptedFilePath+'.json')) {
        return { type: 'sourceFile', filePath: attemptedFilePath+'.json' };
      }

      throw new Error(`Cannot resolve ${chalk.bold(moduleName)}`);
    }
}

exports.resolveRequest = resolveRequest;

let matcher;
let absoluteBaseUrl;
let paths;
function getMatcher() {
    if (!matcher) {
        const result = loadConfig();
        if (result.resultType === 'success') {
            absoluteBaseUrl = result.absoluteBaseUrl;
            paths = result.paths;
            if (DEBUG) {
                console.log(chalk.cyan(`[Nx] Located tsconfig at ${chalk.bold(absoluteBaseUrl)}`));
                console.log(chalk.cyan(`[Nx] Found the following paths:\n:${chalk.bold(JSON.stringify(paths, null, 2))}`));
            }
            matcher = createMatchPath(absoluteBaseUrl, paths);
        }
        else {
            console.log(chalk.cyan(`[Nx] Failed to locate tsconfig}`));
            throw new Error(`Could not load tsconfig for project`);
        }
    }
    return matcher;
}
//# sourceMappingURL=metro-resolver.js.map

// require.extensions['.tsx'] = () => true;
// require.extensions['.ts'] = () => true;
// console.log(require.extensions);
console.log(getMatcher()('@island.is/island-ui-native:lib/Button/Button.tsx'));
