"use strict";
/*
 * SonarQube JavaScript Plugin
 * Copyright (C) 2011-2022 SonarSource SA
 * mailto:info AT sonarsource DOT com
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 3 of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program; if not, write to the Free Software Foundation,
 * Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */
// https://sonarsource.github.io/rspec/#/rspec/S4328/javascript
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const builtin_modules_1 = __importDefault(require("builtin-modules"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const ts = __importStar(require("typescript"));
const helpers_1 = require("helpers");
const DefinitelyTyped = '@types/';
/**
 * Cache for each dirname the dependencies of the package.json in this directory, empty set when no package.json.
 */
const dirCache = new Map();
/**
 * Cache for the available dependencies by dirname.
 */
const cache = new Map();
exports.rule = {
    meta: {
        messages: {
            removeOrAddDependency: 'Either remove this import or add it as a dependency.',
        },
    },
    create(context) {
        const whitelist = context.options;
        const dependencies = getDependencies(context.getFilename());
        const aliasedPathsMappingPatterns = extractPathMappingPatterns(context.parserServices);
        const baseUrl = getBaseUrl(context.parserServices);
        if (aliasedPathsMappingPatterns === 'matchAll') {
            // deactivates this rule altogether.
            return {};
        }
        return {
            CallExpression: (node) => {
                const call = node;
                if (call.callee.type === 'Identifier' &&
                    call.callee.name === 'require' &&
                    call.arguments.length === 1) {
                    const [argument] = call.arguments;
                    if (argument.type === 'Literal') {
                        const requireToken = call.callee;
                        raiseOnImplicitImport(argument, requireToken.loc, dependencies, whitelist, aliasedPathsMappingPatterns, baseUrl, context);
                    }
                }
            },
            ImportDeclaration: (node) => {
                const module = node.source;
                const importToken = context.getSourceCode().getFirstToken(node);
                raiseOnImplicitImport(module, importToken.loc, dependencies, whitelist, aliasedPathsMappingPatterns, baseUrl, context);
            },
        };
    },
};
function raiseOnImplicitImport(module, loc, dependencies, whitelist, aliasedPathsMappingPatterns, baseUrl, context) {
    const moduleName = module.value;
    if (typeof moduleName !== 'string') {
        return;
    }
    if (ts.isExternalModuleNameRelative(moduleName)) {
        return;
    }
    if (aliasedPathsMappingPatterns.some(pattern => pattern.isApplicableTo(moduleName))) {
        return;
    }
    if (baseUrl) {
        const underBaseUrlPath = path.join(baseUrl, moduleName);
        const extensions = ['', '.ts', '.d.ts', '.tsx', '.js', '.jsx', '.vue', '.mjs'];
        if (extensions.some(extension => fs.existsSync(underBaseUrlPath + extension))) {
            return;
        }
    }
    const packageName = getPackageName(moduleName);
    if (!whitelist.includes(packageName) &&
        !builtin_modules_1.default.includes(packageName) &&
        !dependencies.has(packageName)) {
        context.report({
            messageId: 'removeOrAddDependency',
            loc,
        });
    }
}
function getPackageName(name) {
    /*
      - scoped `@namespace/foo/bar` -> package `@namespace/foo`
      - scope `foo/bar` -> package `foo`
    */
    const parts = name.split('/');
    if (!name.startsWith('@')) {
        return parts[0];
    }
    else {
        return `${parts[0]}/${parts[1]}`;
    }
}
function getDependencies(fileName) {
    let dirname = path.dirname(fileName);
    const cached = cache.get(dirname);
    if (cached) {
        return cached;
    }
    const result = new Set();
    cache.set(dirname, result);
    while (true) {
        const dirCached = dirCache.get(dirname);
        if (dirCached) {
            dirCached.forEach(d => result.add(d));
        }
        else {
            const packageJsonPath = path.join(path.resolve(dirname), 'package.json');
            const dep = fs.existsSync(packageJsonPath)
                ? getDependenciesFromPackageJson(packageJsonPath)
                : new Set();
            dep.forEach(d => result.add(d));
            dirCache.set(dirname, dep);
        }
        const upperDir = path.dirname(dirname);
        if (upperDir === dirname) {
            break;
        }
        else {
            dirname = upperDir;
        }
    }
    return result;
}
function getDependenciesFromPackageJson(packageJsonPath) {
    const result = new Set();
    try {
        const content = JSON.parse((0, helpers_1.readFile)(packageJsonPath));
        if (content.dependencies !== undefined) {
            addDependencies(result, content.dependencies);
        }
        if (content.devDependencies !== undefined) {
            addDependencies(result, content.devDependencies);
        }
        if (content.peerDependencies !== undefined) {
            addDependencies(result, content.peerDependencies);
        }
    }
    catch (_a) { }
    return result;
}
function addDependencies(result, dependencies) {
    Object.keys(dependencies).forEach(name => result.add(name.startsWith(DefinitelyTyped) ? name.substring(DefinitelyTyped.length) : name));
}
class PathMappingNoAsteriskPattern {
    constructor(value) {
        this.value = value;
    }
    isApplicableTo(name) {
        return name === this.value;
    }
}
class PathMappingSingleAsteriskPattern {
    constructor(prefix, suffix) {
        this.prefix = prefix;
        this.suffix = suffix;
    }
    isApplicableTo(name) {
        return name.startsWith(this.prefix) && name.endsWith(this.suffix);
    }
}
const PATH_MAPPING_ASTERISK_PATTERN = /^([^*]*)\*([^*]*)$/; // matches any string with single asterisk '*'
const PATH_MAPPING_ASTERISK_PATTERN_PREFIX_IDX = 1;
const PATH_MAPPING_ASTERISK_PATTERN_SUFFIX_IDX = 2;
function extractPathMappingPatterns(parserServices) {
    const compilerOptions = parserServices.program && parserServices.program.getCompilerOptions();
    const paths = (compilerOptions && compilerOptions.paths) || [];
    const pathMappingPatterns = [];
    for (const p in paths) {
        if (p === '*') {
            return 'matchAll';
        }
        else {
            const m = p.match(PATH_MAPPING_ASTERISK_PATTERN);
            if (m) {
                pathMappingPatterns.push(new PathMappingSingleAsteriskPattern(m[PATH_MAPPING_ASTERISK_PATTERN_PREFIX_IDX], m[PATH_MAPPING_ASTERISK_PATTERN_SUFFIX_IDX]));
            }
            else if (!p.includes('*')) {
                pathMappingPatterns.push(new PathMappingNoAsteriskPattern(p));
            }
            else {
                // This case should not occur: `tsc` emits error if there is more than one asterisk
            }
        }
    }
    return pathMappingPatterns;
}
function getBaseUrl(parserServices) {
    if (parserServices.program && parserServices.program.getCompilerOptions()) {
        return parserServices.program.getCompilerOptions().baseUrl;
    }
    return undefined;
}
//# sourceMappingURL=no-implicit-dependencies.js.map