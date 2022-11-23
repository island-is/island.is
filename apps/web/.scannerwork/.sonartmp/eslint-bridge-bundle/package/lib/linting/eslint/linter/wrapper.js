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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinterWrapper = void 0;
const eslint_1 = require("eslint");
const eslint_plugin_sonarjs_1 = require("eslint-plugin-sonarjs");
const eslint_plugin_react_1 = require("eslint-plugin-react");
const eslint_plugin_1 = require("@typescript-eslint/eslint-plugin");
const eslint_2 = require("linting/eslint");
const custom_rules_1 = require("./custom-rules");
const config_1 = require("./config");
const decoration_1 = require("./decoration");
const issues_1 = require("./issues");
/**
 * A wrapper of ESLint linter
 *
 * The purpose of the wrapper is to configure the behaviour of ESLint linter,
 * which includes:
 *
 * - defining the rules that should be used during linting,
 * - declaring globals that need to be considered as such
 * - defining the environments bringing a set of predefined variables
 *
 * Because some rules target main files while other target test files (or even
 * both), the wrapper relies on two linting configurations to decide which set
 * of rules should be considered during linting.
 *
 * Last but not least, the linter wrapper eventually turns ESLint problems,
 * also known as messages, into SonarQube issues.
 */
class LinterWrapper {
    /**
     * Constructs an ESLint linter wrapper
     *
     * Constructing an linter wrapper consists in building the rule database
     * the internal ESLint linter shall consider during linting. Furthermore,
     * it creates a linting configuration that configures which rules should
     * be used on linting based on the active quality profile and file type.
     *
     * @param inputRules the quality profile rules
     * @param customRules the additional custom rules
     * @param environments the JavaScript environments
     * @param globals the global variables
     */
    constructor(inputRules, customRules = [], environments = [], globals = []) {
        this.linter = new eslint_1.Linter();
        this.rules = this.defineRules(customRules);
        this.config = this.createConfig(inputRules, this.rules, environments, globals);
    }
    /**
     * Lints an ESLint source code instance
     *
     * Linting a source code implies using ESLint linting functionality to find
     * problems in the code. It selects which linting configuration needs to be
     * considered during linting based on the file type.
     *
     * @param sourceCode the ESLint source code
     * @param filePath the path of the source file
     * @param fileType the type of the source file
     * @returns the linting result
     */
    lint(sourceCode, filePath, fileType = 'MAIN') {
        const fileTypeConfig = this.config[fileType];
        const config = { ...fileTypeConfig, settings: { ...fileTypeConfig.settings, fileType } };
        const options = { filename: filePath, allowInlineConfig: false };
        const messages = this.linter.verify(sourceCode, config, options);
        return (0, issues_1.transformMessages)(messages, { sourceCode, rules: this.rules });
    }
    /**
     * Defines the wrapper's rule database
     *
     * The wrapper's rule database is mainly built upon the set of homemade
     * rules implemented internally in the bridge as well as the ESLint core
     * rules from the ESLint linter. Some other rules from selected ESLint
     * plugins extend the rule database as well as (internal) custom rules.
     * These external rules might even be decorated by internal decorators
     * in order to refine their behaviour.
     *
     * @param customRules a set of custom rules to add
     * @returns a complete database of ESLint-based rules
     */
    defineRules(customRules) {
        const externalRules = this.getExternalRules();
        /**
         * The order of defining rules is important here because internal rules
         * and external ones might share the same name by accident, which would
         * unexpectedly overwrite the behaviour of the internal one in favor of
         * the external one. This is why some internal rules are named with the
         * prefix `sonar-`, e.g., `sonar-no-fallthrough`.
         */
        this.linter.defineRules(externalRules);
        this.linter.defineRules(eslint_plugin_sonarjs_1.rules);
        this.linter.defineRules(eslint_2.rules);
        for (const customRule of customRules) {
            this.linter.defineRule(customRule.ruleId, customRule.ruleModule);
        }
        for (const internalCustomRule of custom_rules_1.customRules) {
            this.linter.defineRule(internalCustomRule.ruleId, internalCustomRule.ruleModule);
        }
        return this.linter.getRules();
    }
    /**
     * Gets the external ESLint-based rules
     *
     * The external ESLint-based rules includes all the rules that are
     * not implemented internally, in other words, rules from external
     * dependencies which includes ESLint core rules. Furthermore, the
     * returned rules are decorated either by internal decorators or by
     * special decorations.
     *
     * @returns the ESLint-based external rules
     */
    getExternalRules() {
        const externalRules = {};
        const coreESLintRules = Object.fromEntries(new eslint_1.Linter().getRules());
        /**
         * The order of defining rules from external dependencies is important here.
         * Core ESLint rules could be overriden by the implementation from specific
         * dependencies, which should be the default behaviour in most cases. If for
         * some reason a different behaviour is needed for a particular rule, one can
         * specify it in `decorateExternalRules`.
         */
        const dependencies = [coreESLintRules, eslint_plugin_1.rules, eslint_plugin_react_1.rules];
        for (const dependencyRules of dependencies) {
            for (const [name, module] of Object.entries(dependencyRules)) {
                externalRules[name] = module;
            }
        }
        (0, decoration_1.decorateExternalRules)(externalRules);
        return externalRules;
    }
    /**
     * Creates the wrapper's linting configuration
     *
     * The wrapper's linting configuration actually includes two
     * ESLint configurations: one per file type.
     *
     * @param inputRules the rules from the active quality profile
     * @param linterRules the rules defined in the linter
     * @param environments the JavaScript environments
     * @param globals the global variables
     * @returns the wrapper's linting configuration
     */
    createConfig(inputRules, linterRules, environments, globals) {
        const mainRules = [];
        const testRules = [];
        for (const inputRule of inputRules) {
            if (inputRule.fileTypeTarget.includes('MAIN')) {
                mainRules.push(inputRule);
            }
            if (inputRule.fileTypeTarget.includes('TEST')) {
                testRules.push(inputRule);
            }
        }
        const mainConfig = (0, config_1.createLinterConfig)(mainRules, linterRules, environments, globals);
        const testConfig = (0, config_1.createLinterConfig)(testRules, linterRules, environments, globals);
        return { ['MAIN']: mainConfig, ['TEST']: testConfig };
    }
}
exports.LinterWrapper = LinterWrapper;
//# sourceMappingURL=wrapper.js.map