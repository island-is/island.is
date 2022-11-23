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
exports.getSyntaxHighlighting = void 0;
const helpers_1 = require("./metrics/helpers");
/**
 * Computes the syntax highlighting of an ESLint source code
 * @param sourceCode the source code to highlight
 * @returns a list of highlighted tokens
 */
function getSyntaxHighlighting(sourceCode) {
    const { tokens, comments } = (0, helpers_1.extractTokensAndComments)(sourceCode);
    const highlights = [];
    for (const token of tokens) {
        switch (token.type) {
            case 'HTMLTagOpen':
            case 'HTMLTagClose':
            case 'HTMLEndTagOpen':
            case 'HTMLSelfClosingTagClose':
            case 'Keyword':
                highlight(token, 'KEYWORD', highlights);
                break;
            case 'HTMLLiteral':
            case 'String':
            case 'Template':
            case 'RegularExpression':
                highlight(token, 'STRING', highlights);
                break;
            case 'Numeric':
                highlight(token, 'CONSTANT', highlights);
                break;
        }
    }
    for (const comment of comments) {
        if ((comment.type === 'Block' && comment.value.startsWith('*')) ||
            comment.type === 'HTMLBogusComment') {
            highlight(comment, 'STRUCTURED_COMMENT', highlights);
        }
        else {
            highlight(comment, 'COMMENT', highlights);
        }
    }
    return { highlights };
}
exports.getSyntaxHighlighting = getSyntaxHighlighting;
function highlight(node, highlightKind, highlights) {
    if (!node.loc) {
        return;
    }
    const startPosition = node.loc.start;
    const endPosition = node.loc.end;
    highlights.push({
        location: {
            startLine: startPosition.line,
            startCol: startPosition.column,
            endLine: endPosition.line,
            endCol: endPosition.column,
        },
        textType: highlightKind,
    });
}
//# sourceMappingURL=syntax-highlighting.js.map