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
exports.findCommentLines = void 0;
const helpers_1 = require("./helpers");
/**
 * A comment marker to tell SonarQube to ignore any issue on the same line
 * as the one with a comment whose text is `NOSONAR` (case-insensitive).
 */
const NOSONAR = 'NOSONAR';
/**
 * Finds the line numbers of comments in the source code
 * @param sourceCode the source code to visit
 * @param ignoreHeaderComments a flag to ignore file header comments
 * @returns the line numbers of comments
 */
function findCommentLines(sourceCode, ignoreHeaderComments) {
    const commentLines = new Set();
    const nosonarLines = new Set();
    let comments = sourceCode.ast.comments;
    // ignore header comments -> comments before first token
    const firstToken = sourceCode.getFirstToken(sourceCode.ast);
    if (firstToken && ignoreHeaderComments) {
        const header = sourceCode.getCommentsBefore(firstToken);
        comments = comments.slice(header.length);
    }
    for (const comment of comments) {
        if (comment.loc) {
            const commentValue = comment.value.startsWith('*')
                ? comment.value.substring(1).trim()
                : comment.value.trim();
            if (commentValue.toUpperCase().startsWith(NOSONAR)) {
                (0, helpers_1.addLines)(comment.loc.start.line, comment.loc.end.line, nosonarLines);
            }
            else if (commentValue.length > 0) {
                (0, helpers_1.addLines)(comment.loc.start.line, comment.loc.end.line, commentLines);
            }
        }
    }
    return {
        commentLines: Array.from(commentLines).sort((a, b) => a - b),
        nosonarLines: Array.from(nosonarLines).sort((a, b) => a - b),
    };
}
exports.findCommentLines = findCommentLines;
//# sourceMappingURL=comments.js.map