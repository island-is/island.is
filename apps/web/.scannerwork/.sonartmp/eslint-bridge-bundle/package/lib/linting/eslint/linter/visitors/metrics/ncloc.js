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
exports.findNcloc = void 0;
const helpers_1 = require("./helpers");
/**
 * Finds the line numbers of code (ncloc)
 *
 * The line numbers of code denote physical lines that contain at least
 * one character which is neither a whitespace nor a tabulation nor part
 * of a comment.
 *
 * @param sourceCode the ESLint source code
 * @returns the line numbers of code
 */
function findNcloc(sourceCode) {
    const lines = new Set();
    const tokens = sourceCode.ast.tokens;
    for (const token of tokens) {
        (0, helpers_1.addLines)(token.loc.start.line, token.loc.end.line, lines);
    }
    return Array.from(lines).sort((a, b) => a - b);
}
exports.findNcloc = findNcloc;
//# sourceMappingURL=ncloc.js.map