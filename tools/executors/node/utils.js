"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exec = exports.createTmpTsConfig = void 0;
var tslib_1 = require("tslib");
var fs_1 = require("fs");
var path_1 = require("path");
var devkit_1 = require("@nrwl/devkit");
var child_process_1 = require("child_process");
/**
 * This "hacky" code is copied and tweaked from @nrwl/workspace.
 * It allows us to override the tsconfig for webpack to have `"module": "commonjs",`.
 */
function createTmpTsConfig(tsconfigPath, workspaceRoot, projectRoot) {
    var tmpTsConfigPath = (0, path_1.join)(workspaceRoot, 'tmp', projectRoot, 'tsconfig.commonjs.generated.json');
    var parsedTSConfig = readTsConfigWithCommonJs(tsconfigPath, tmpTsConfigPath);
    process.on('exit', function () { return cleanupTmpTsConfigFile(tmpTsConfigPath); });
    (0, devkit_1.writeJsonFile)(tmpTsConfigPath, parsedTSConfig);
    return (0, path_1.join)(tmpTsConfigPath);
}
exports.createTmpTsConfig = createTmpTsConfig;
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
/**
 * Wraps child_process.spawn with more user friendly interface
 * and to be async using Promise.
 * @param {string} command
 * @param {SpawnOptions} options Same options as defined for `child_process.spawn()`
 * @returns Promise
 */
function exec(command, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var cmd = (0, child_process_1.spawn)(command, (0, tslib_1.__assign)({ stdio: 'inherit', shell: true }, options));
        cmd.on('exit', function (exitCode) {
            if (exitCode === 0) {
                resolve();
            }
            else {
                var error = new Error("Command '" + command + "' exited with non-zero exit code " + exitCode);
                reject(error);
            }
        });
    });
}
exports.exec = exec;
//# sourceMappingURL=utils.js.map