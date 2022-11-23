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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinterWrapper = void 0;
const stylelint_1 = __importDefault(require("stylelint"));
const issues_1 = require("./issues");
const stylelint_2 = require("linting/stylelint");
/**
 * A wrapper of Stylelint linter
 */
class LinterWrapper {
    /**
     * Constructs a Stylelint wrapper
     */
    constructor() {
        this.defineRules();
    }
    /**
     * Lints a stylesheet
     *
     * Linting a stylesheet implies using Stylelint linting functionality to find
     * problems in the sheet. It does not need to be provided with an abstract
     * syntax tree as Stylelint takes care of the parsing internally.
     *
     * The result of linting a stylesheet requires post-linting transformations
     * to return SonarQube issues. These transformations essentially consist in
     * transforming Stylelint results into SonarQube issues.
     *
     * Because stylesheets are far different from what a source code is, metrics
     * computation does not make sense when analyzing such file contents. Issues
     * only are returned after linting.
     *
     * @param filePath the path of the stylesheet
     * @param options the linting options
     * @returns the found issues
     */
    lint(filePath, options) {
        return stylelint_1.default
            .lint(options)
            .then(result => ({ issues: (0, issues_1.transform)(result.results, filePath) }));
    }
    /**
     * Defines the wrapper's rules
     *
     * Besides Stylelint rules, the linter wrapper includes all the rules that
     * are implemented internally.
     */
    defineRules() {
        for (const key in stylelint_2.rules) {
            stylelint_1.default.rules[key] = stylelint_2.rules[key];
        }
    }
}
exports.LinterWrapper = LinterWrapper;
//# sourceMappingURL=wrapper.js.map