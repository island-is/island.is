"use strict";
// UPGRADE WARNING:
// - Expects compatibility between @nx/node:webpack and @anatine/esbuildnx:build
// - Special logic around externalDependencies and option handling.
// - Modifying workspace object and running executor recursively.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var devkit_1 = require("@nx/devkit");
var utils_1 = require("./utils");
var EXTERNAL_DEPENDENCIES_DEFAULT_VALUE = 'all';
/**
 * Runs webpack executor for local dev and esbuild executor for production builds.
 *
 * We do this because we need esbuildnx for production builds but its watch logic is broken and hurts DX.
 */
function buildExecutor(options, context) {
    return tslib_1.__asyncGenerator(this, arguments, function buildExecutor_1() {
        var project, target, workspace, projectInfo, targets;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    project = context.projectName, target = context.targetName, workspace = context.workspace;
                    projectInfo = workspace === null || workspace === void 0 ? void 0 : workspace.projects[project];
                    targets = projectInfo === null || projectInfo === void 0 ? void 0 : projectInfo.targets;
                    if (!project || !target || !projectInfo || !targets) {
                        throw new Error('Missing project or target');
                    }
                    // Override the executor of the current task and re-run.
                    // This was the only way to run different executors with the same options.
                    if (!options.watch) {
                        targets[target].executor = '@anatine/esbuildnx:build';
                    }
                    else {
                        targets[target].executor = '@nx/webpack:webpack';
                        targets[target].options.compiler = 'tsc';
                        targets[target].options.target = 'node';
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
                    return [4 /*yield*/, tslib_1.__await((0, devkit_1.runExecutor)({ project: project, target: target, configuration: context.configurationName }, options, context))];
                case 1: return [5 /*yield**/, tslib_1.__values(tslib_1.__asyncDelegator.apply(void 0, [tslib_1.__asyncValues.apply(void 0, [_a.sent()])]))];
                case 2: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_a.sent()])];
                case 3: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_a.sent()])];
                case 4: 
                // Inception!
                return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.default = buildExecutor;
//# sourceMappingURL=impl.js.map