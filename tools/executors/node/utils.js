"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTmpTsConfig = createTmpTsConfig;
var fs_1 = require("fs");
var path_1 = require("path");
var devkit_1 = require("@nx/devkit");
/**
 * This "hacky" code is copied and tweaked from @nx/workspace.
 * It allows us to override the tsconfig for webpack to have `"module": "commonjs",`.
 */
function createTmpTsConfig(tsconfigPath, workspaceRoot, projectRoot) {
    var tmpTsConfigPath = (0, path_1.join)(workspaceRoot, 'tmp', projectRoot, 'tsconfig.commonjs.generated.json');
    var parsedTSConfig = readTsConfigWithCommonJs(tsconfigPath, tmpTsConfigPath);
    process.on('exit', function () { return cleanupTmpTsConfigFile(tmpTsConfigPath); });
    (0, devkit_1.writeJsonFile)(tmpTsConfigPath, parsedTSConfig);
    return (0, path_1.join)(tmpTsConfigPath);
}
function readTsConfigWithCommonJs(tsConfig, generatedTsConfigPath) {
    var generatedTsConfig = { compilerOptions: {} };
    generatedTsConfig.extends = (0, path_1.relative)((0, path_1.dirname)(generatedTsConfigPath), tsConfig);
    generatedTsConfig.compilerOptions.module = 'commonjs';
    return generatedTsConfig;
}
function cleanupTmpTsConfigFile(tmpTsConfigPath) {
    try {
        if (tmpTsConfigPath) {
            (0, fs_1.unlinkSync)(tmpTsConfigPath);
        }
    }
    catch (e) { }
}
//# sourceMappingURL=utils.js.map