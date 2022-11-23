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
exports.computeMetrics = void 0;
const classes_1 = require("./classes");
const comments_1 = require("./comments");
const cyclomatic_complexity_1 = require("./cyclomatic-complexity");
const executable_lines_1 = require("./executable-lines");
const functions_1 = require("./functions");
const ncloc_1 = require("./ncloc");
const statements_1 = require("./statements");
/**
 * Computes the metrics of an ESLint source code
 * @param sourceCode the ESLint source code
 * @param ignoreHeaderComments a flag to ignore file header comments
 * @param cognitiveComplexity the cognitive complexity of the source code
 * @returns the source code metrics
 */
function computeMetrics(sourceCode, ignoreHeaderComments, cognitiveComplexity = 0) {
    return {
        ncloc: (0, ncloc_1.findNcloc)(sourceCode),
        ...(0, comments_1.findCommentLines)(sourceCode, ignoreHeaderComments),
        executableLines: (0, executable_lines_1.findExecutableLines)(sourceCode),
        functions: (0, functions_1.countFunctions)(sourceCode),
        statements: (0, statements_1.countStatements)(sourceCode),
        classes: (0, classes_1.countClasses)(sourceCode),
        complexity: (0, cyclomatic_complexity_1.computeCyclomaticComplexity)(sourceCode),
        cognitiveComplexity,
    };
}
exports.computeMetrics = computeMetrics;
//# sourceMappingURL=compute.js.map