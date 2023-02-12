"use strict";
// UPGRADE WARNING:
// - Expects compatibility between @nrwl/node:webpack and @anatine/esbuildnx:build
// - Special logic around externalDependencies and option handling.
// - Modifying workspace object and running executor recursively.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var devkit_1 = require("@nrwl/devkit");
var utils_1 = require("./utils");
var EXTERNAL_DEPENDENCIES_DEFAULT_VALUE = 'all';
/**
 * Runs webpack executor for local dev and esbuild executor for production builds.
 *
 * We do this because we need esbuildnx for production builds but its watch logic is broken and hurts DX.
 */
function buildExecutor(options, context) {
    return (0, tslib_1.__asyncGenerator)(this, arguments, function buildExecutor_1() {
        var project, target, workspace, projectInfo, targets, _i, _a, cmd;
        return (0, tslib_1.__generator)(this, function (_b) {
            switch (_b.label) {
                case 0:
                    project = context.projectName, target = context.targetName, workspace = context.workspace;
                    projectInfo = workspace.projects[project];
                    targets = projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.targets;
                    if (!project || !target || !projectInfo || !targets) {
                        throw new Error('Missing project or target');
                    }
                    if (!(options.preBuildCommands && options.preBuildCommands.length > 0)) return [3 /*break*/, 5];
                    console.log('Running pre-build commands...');
                    _i = 0, _a = options.preBuildCommands;
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 4];
                    cmd = _a[_i];
                    return [4 /*yield*/, (0, tslib_1.__await)((0, utils_1.exec)(cmd))];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4:
                    console.log('Running pre-build done ✅');
                    _b.label = 5;
                case 5:
                    // Override the executor of the current task and re-run.
                    // This was the only way to run different executors with the same options.
                    if (!options.watch) {
                        targets[target].executor = '@anatine/esbuildnx:build';
                    }
                    else {
                        targets[target].executor = '@nrwl/node:webpack';
                        // WARNING -- this is a doozy:
                        // webpack5 + es modules + typescript metadata reflection + circular dependencies + barrel files = JS errors
                        // NX recommends avoiding barrel files and circular dependencies for this reason, but this would be a big change
                        // for many of our projects. They also configure tsConfig in node projects to emit commonjs modules, which works
                        // better in this case. However, telling esbuild to emit commonjs modules triggers more CD errors :(
                        // -- So we override tsConfig for webpack only.
                        options.tsConfig = (0, utils_1.createTmpTsConfig)(options.tsConfig, context.root, projectInfo.root);
                    }
                    // This setting in the webpack executor supports an enum and an array. The default
                    // value is "all", but `runExecutor` converts it into ["all"] which has different
                    // behaviour. If we remove this default value, it gets reset in `runExecutor`.
                    if (options.externalDependencies === EXTERNAL_DEPENDENCIES_DEFAULT_VALUE) {
                        delete options.externalDependencies;
                    }
                    return [4 /*yield*/, (0, tslib_1.__await)((0, devkit_1.runExecutor)({ project: project, target: target, configuration: context.configurationName }, options, context))];
                case 6: return [5 /*yield**/, (0, tslib_1.__values)(tslib_1.__asyncDelegator.apply(void 0, [tslib_1.__asyncValues.apply(void 0, [_b.sent()])]))];
                case 7: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_b.sent()])];
                case 8: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_b.sent()])];
                case 9: 
                // Inception!
                return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.default = buildExecutor;
//# sourceMappingURL=impl.js.map