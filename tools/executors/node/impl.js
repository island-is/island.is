"use strict";
// UPGRADE WARNING:
// - Updated to use @nx/esbuild:esbuild instead of @anatine/esbuildnx:build for Nx 21 compatibility
// - Removed deprecated workspace modification approach
// - Using proper Nx 21 project graph API
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildExecutor;
var tslib_1 = require("tslib");
var utils_1 = require("./utils");
var EXTERNAL_DEPENDENCIES_DEFAULT_VALUE = 'all';
/**
 * Runs webpack executor for local dev and esbuild executor for production builds.
 *
 * We do this because we need esbuild for production builds but its watch logic is broken and hurts DX.
 */
function buildExecutor(options, context) {
    return tslib_1.__asyncGenerator(this, arguments, function buildExecutor_1() {
        var project, target, projectGraph, projectInfo, executorOptions, esbuildOptions, esbuildExecutor, result, _a, result_1, result_1_1, output, e_1_1, tmpTsConfig, webpackOptions, webpackExecutor, result, _b, result_2, result_2_1, output, e_2_1;
        var _c, e_1, _d, _e, _f, e_2, _g, _h;
        var _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7;
        return tslib_1.__generator(this, function (_8) {
            switch (_8.label) {
                case 0:
                    project = context.projectName, target = context.targetName;
                    if (!project || !target) {
                        throw new Error('Missing project or target');
                    }
                    projectGraph = context.projectGraph;
                    projectInfo = projectGraph === null || projectGraph === void 0 ? void 0 : projectGraph.nodes[project];
                    if (!projectInfo) {
                        throw new Error("Project ".concat(project, " not found in project graph"));
                    }
                    executorOptions = tslib_1.__assign({}, options);
                    if (executorOptions.externalDependencies === EXTERNAL_DEPENDENCIES_DEFAULT_VALUE) {
                        delete executorOptions.externalDependencies;
                    }
                    if (!!options.watch) return [3 /*break*/, 15];
                    esbuildOptions = tslib_1.__assign(tslib_1.__assign({}, executorOptions), { main: options.main, outputPath: options.outputPath, tsConfig: options.tsConfig, sourceMap: (_j = options.sourceMap) !== null && _j !== void 0 ? _j : true, optimization: (_k = options.optimization) !== null && _k !== void 0 ? _k : false, generatePackageJson: (_l = options.generatePackageJson) !== null && _l !== void 0 ? _l : false, assets: (_m = options.assets) !== null && _m !== void 0 ? _m : [], fileReplacements: (_o = options.fileReplacements) !== null && _o !== void 0 ? _o : [], buildLibsFromSource: (_p = options.buildLibsFromSource) !== null && _p !== void 0 ? _p : true, showCircularDependencies: (_q = options.showCircularDependencies) !== null && _q !== void 0 ? _q : false, external: (_r = options.external) !== null && _r !== void 0 ? _r : [], format: ['cjs'] });
                    esbuildExecutor = require('@nx/esbuild/src/executors/esbuild/esbuild.impl').default;
                    result = esbuildExecutor(esbuildOptions, context);
                    _8.label = 1;
                case 1:
                    _8.trys.push([1, 8, 9, 14]);
                    _a = true, result_1 = tslib_1.__asyncValues(result);
                    _8.label = 2;
                case 2: return [4 /*yield*/, tslib_1.__await(result_1.next())];
                case 3:
                    if (!(result_1_1 = _8.sent(), _c = result_1_1.done, !_c)) return [3 /*break*/, 7];
                    _e = result_1_1.value;
                    _a = false;
                    output = _e;
                    return [4 /*yield*/, tslib_1.__await(output)];
                case 4: return [4 /*yield*/, _8.sent()];
                case 5:
                    _8.sent();
                    _8.label = 6;
                case 6:
                    _a = true;
                    return [3 /*break*/, 2];
                case 7: return [3 /*break*/, 14];
                case 8:
                    e_1_1 = _8.sent();
                    e_1 = { error: e_1_1 };
                    return [3 /*break*/, 14];
                case 9:
                    _8.trys.push([9, , 12, 13]);
                    if (!(!_a && !_c && (_d = result_1.return))) return [3 /*break*/, 11];
                    return [4 /*yield*/, tslib_1.__await(_d.call(result_1))];
                case 10:
                    _8.sent();
                    _8.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7 /*endfinally*/];
                case 13: return [7 /*endfinally*/];
                case 14: return [3 /*break*/, 29];
                case 15:
                    tmpTsConfig = (0, utils_1.createTmpTsConfig)(options.tsConfig, context.root, projectInfo.data.root);
                    webpackOptions = tslib_1.__assign(tslib_1.__assign({}, executorOptions), { main: options.main, outputPath: options.outputPath, tsConfig: tmpTsConfig, compiler: 'tsc', target: 'node', sourceMap: (_s = options.sourceMap) !== null && _s !== void 0 ? _s : true, progress: (_t = options.progress) !== null && _t !== void 0 ? _t : false, statsJson: (_u = options.statsJson) !== null && _u !== void 0 ? _u : false, verbose: (_v = options.verbose) !== null && _v !== void 0 ? _v : false, extractLicenses: (_w = options.extractLicenses) !== null && _w !== void 0 ? _w : false, optimization: (_x = options.optimization) !== null && _x !== void 0 ? _x : false, maxWorkers: options.maxWorkers, memoryLimit: (_y = options.memoryLimit) !== null && _y !== void 0 ? _y : 8192, assets: (_z = options.assets) !== null && _z !== void 0 ? _z : [], fileReplacements: (_0 = options.fileReplacements) !== null && _0 !== void 0 ? _0 : [], webpackConfig: (_1 = options.webpackConfig) !== null && _1 !== void 0 ? _1 : './tools/executors/node/webpack.config.js', buildLibsFromSource: (_2 = options.buildLibsFromSource) !== null && _2 !== void 0 ? _2 : true, generatePackageJson: (_3 = options.generatePackageJson) !== null && _3 !== void 0 ? _3 : false, transformers: (_4 = options.transformers) !== null && _4 !== void 0 ? _4 : [], additionalEntryPoints: (_5 = options.additionalEntryPoints) !== null && _5 !== void 0 ? _5 : [], outputFileName: (_6 = options.outputFileName) !== null && _6 !== void 0 ? _6 : 'main.js', poll: options.poll, showCircularDependencies: (_7 = options.showCircularDependencies) !== null && _7 !== void 0 ? _7 : false });
                    webpackExecutor = require('@nx/webpack/src/executors/webpack/webpack.impl').default;
                    result = webpackExecutor(webpackOptions, context);
                    _8.label = 16;
                case 16:
                    _8.trys.push([16, 23, 24, 29]);
                    _b = true, result_2 = tslib_1.__asyncValues(result);
                    _8.label = 17;
                case 17: return [4 /*yield*/, tslib_1.__await(result_2.next())];
                case 18:
                    if (!(result_2_1 = _8.sent(), _f = result_2_1.done, !_f)) return [3 /*break*/, 22];
                    _h = result_2_1.value;
                    _b = false;
                    output = _h;
                    return [4 /*yield*/, tslib_1.__await(output)];
                case 19: return [4 /*yield*/, _8.sent()];
                case 20:
                    _8.sent();
                    _8.label = 21;
                case 21:
                    _b = true;
                    return [3 /*break*/, 17];
                case 22: return [3 /*break*/, 29];
                case 23:
                    e_2_1 = _8.sent();
                    e_2 = { error: e_2_1 };
                    return [3 /*break*/, 29];
                case 24:
                    _8.trys.push([24, , 27, 28]);
                    if (!(!_b && !_f && (_g = result_2.return))) return [3 /*break*/, 26];
                    return [4 /*yield*/, tslib_1.__await(_g.call(result_2))];
                case 25:
                    _8.sent();
                    _8.label = 26;
                case 26: return [3 /*break*/, 28];
                case 27:
                    if (e_2) throw e_2.error;
                    return [7 /*endfinally*/];
                case 28: return [7 /*endfinally*/];
                case 29: return [2 /*return*/];
            }
        });
    });
}
//# sourceMappingURL=impl.js.map