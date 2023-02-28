"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTmpTsConfig = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var devkit_1 = require("@nrwl/devkit");
/**
 * This "hacky" code is copied and tweaked from @nrwl/workspace.
 * It allows us to override the tsconfig for webpack to have `"module": "commonjs",`.
 */
function createTmpTsConfig(tsconfigPath, workspaceRoot, projectRoot) {
    var tmpTsConfigPath = path_1.join(workspaceRoot, 'tmp', projectRoot, 'tsconfig.commonjs.generated.json');
    var parsedTSConfig = readTsConfigWithCommonJs(tsconfigPath, tmpTsConfigPath);
    process.on('exit', function () { return cleanupTmpTsConfigFile(tmpTsConfigPath); });
    devkit_1.writeJsonFile(tmpTsConfigPath, parsedTSConfig);
    return path_1.join(tmpTsConfigPath);
}
exports.createTmpTsConfig = createTmpTsConfig;
function readTsConfigWithCommonJs(tsConfig, generatedTsConfigPath) {
    var generatedTsConfig = { compilerOptions: {} };
    generatedTsConfig.extends = path_1.relative(path_1.dirname(generatedTsConfigPath), tsConfig);
    generatedTsConfig.compilerOptions.module = 'commonjs';
    return generatedTsConfig;
}
function cleanupTmpTsConfigFile(tmpTsConfigPath) {
    try {
        if (tmpTsConfigPath) {
            fs_1.unlinkSync(tmpTsConfigPath);
        }
    }
    catch (e) { }
}
//# sourceMappingURL=utils.js.map