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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLinter = exports.initializeLinter = void 0;
const errors_1 = require("errors");
const helpers_1 = require("helpers");
const linter_1 = require("./linter");
__exportStar(require("./linter"), exports);
__exportStar(require("./rules"), exports);
/**
 * The global ESLint linters
 *
 * Any linter is expected to be initialized before use.
 * To this end, the plugin is expected to explicitly send a request to
 * initialize a linter before starting the actual analysis of a file.
 * The global linters object will keep the already initialized linters
 * indexed by their linterId. If no linterId is provided, `default` will
 * be used.
 * Having multiple linters (each with different set of rules enabled)
 * is needed in order to not run all rules on 'unchanged' files
 */
const linters = {};
/**
 * Initializes the global linter wrapper
 * @param inputRules the rules from the active quality profiles
 * @param environments the JavaScript execution environments
 * @param globals the global variables
 * @param linterId key of the linter
 */
function initializeLinter(inputRules, environments = [], globals = [], linterId = 'default') {
    const { bundles } = (0, helpers_1.getContext)();
    const customRules = loadBundles(bundles);
    (0, helpers_1.debug)(`Initializing linter "${linterId}" with ${inputRules.map(rule => rule.key)}`);
    linters[linterId] = new linter_1.LinterWrapper(inputRules, customRules, environments, globals);
}
exports.initializeLinter = initializeLinter;
/**
 * Loads rule bundles
 *
 * A rule bundle is a set of external custom rules (like the taint analysis rule)
 * including rule keys and rule definitions that cannot be provided to the linter
 * wrapper using the same feeding channel as rules from the active quality profile.
 *
 * @param bundles the path of rule bundles to load
 * @returns a set of custom rules
 */
function loadBundles(bundles) {
    const customRules = [];
    for (const ruleBundle of bundles) {
        const bundle = require(ruleBundle);
        customRules.push(...bundle.rules);
        const ruleIds = bundle.rules.map((r) => r.ruleId);
        (0, helpers_1.debug)(`Loaded rules ${ruleIds} from ${ruleBundle}`);
    }
    return customRules;
}
/**
 * Returns the linter with the given ID
 *
 * @param linterId key of the linter
 *
 * Throws a runtime error if the global linter wrapper is not initialized.
 */
function getLinter(linterId = 'default') {
    if (!linters[linterId]) {
        throw errors_1.APIError.linterError(`Linter ${linterId} does not exist. Did you call /init-linter?`);
    }
    return linters[linterId];
}
exports.getLinter = getLinter;
//# sourceMappingURL=index.js.map