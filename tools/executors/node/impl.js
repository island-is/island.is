"use strict";
// UPGRADE WARNING:
// - Expects compatibility between @nrwl/node:webpack and @anatine/esbuildnx:build
// - Special logic around externalDependencies and option handling.
// - Modifying workspace object and running executor recursively.
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var devkit_1 = require("@nrwl/devkit");
var EXTERNAL_DEPENDENCIES_DEFAULT_VALUE = 'all';
/**
 * Runs webpack executor for local dev and esbuild executor for production builds.
 *
 * We do this because we need esbuildnx for production builds but its watch logic is broken and hurts DX.
 */
function buildExecutor(options, context) {
    var _a;
    return tslib_1.__asyncGenerator(this, arguments, function buildExecutor_1() {
        var project, target, workspace, targets;
        return tslib_1.__generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    project = context.projectName, target = context.targetName, workspace = context.workspace;
                    targets = (_a = workspace.projects[project]) === null || _a === void 0 ? void 0 : _a.targets;
                    if (!project || !target || !targets) {
                        throw new Error('Missing project or target');
                    }
                    // Override the executor of the current task and re-run.
                    // This was the only way to run another executor with the same options.
                    if (options.watch) {
                        targets[target].executor = '@nrwl/node:webpack';
                    }
                    else {
                        targets[target].executor = '@anatine/esbuildnx:build';
                    }
                    // This setting in the webpack executor supports an enum and an array. The default
                    // value is "all", but `runExecutor` converts it into ["all"] which has different
                    // behaviour. If we remove this default value, it gets reset in `runExecutor`.
                    if (options.externalDependencies === EXTERNAL_DEPENDENCIES_DEFAULT_VALUE) {
                        delete options.externalDependencies;
                    }
                    return [4 /*yield*/, tslib_1.__await(devkit_1.runExecutor({ project: project, target: target, configuration: context.configurationName }, options, context))];
                case 1: return [5 /*yield**/, tslib_1.__values(tslib_1.__asyncDelegator.apply(void 0, [tslib_1.__asyncValues.apply(void 0, [_b.sent()])]))];
                case 2: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_b.sent()])];
                case 3: return [4 /*yield*/, tslib_1.__await.apply(void 0, [_b.sent()])];
                case 4: 
                // Inception!
                return [2 /*return*/, _b.sent()];
            }
        });
    });
}
exports.default = buildExecutor;
//# sourceMappingURL=impl.js.map