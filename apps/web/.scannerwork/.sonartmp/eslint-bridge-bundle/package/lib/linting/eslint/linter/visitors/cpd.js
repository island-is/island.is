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
exports.getCpdTokens = void 0;
const visitor_1 = require("./visitor");
/**
 * Extracts the copy-paste detector (cpd) tokens
 * @param sourceCode the source code to extract from
 * @returns the cpd tokens
 */
function getCpdTokens(sourceCode) {
    const cpdTokens = [];
    const tokens = sourceCode.ast.tokens;
    const { jsxTokens, importTokens, requireTokens } = extractTokens(sourceCode);
    tokens.forEach(token => {
        let text = token.value;
        if (text.trim().length === 0) {
            // for EndOfFileToken and JsxText tokens containing only whitespaces
            return;
        }
        if (importTokens.includes(token)) {
            // for tokens from import statements
            return;
        }
        if (requireTokens.includes(token)) {
            // for tokens from require statements
            return;
        }
        if (isStringLiteralToken(token) && !jsxTokens.includes(token)) {
            text = 'LITERAL';
        }
        const startPosition = token.loc.start;
        const endPosition = token.loc.end;
        cpdTokens.push({
            location: {
                startLine: startPosition.line,
                startCol: startPosition.column,
                endLine: endPosition.line,
                endCol: endPosition.column,
            },
            image: text,
        });
    });
    return { cpdTokens };
}
exports.getCpdTokens = getCpdTokens;
/**
 * Extracts specific tokens to be ignored by copy-paste detection
 * @param sourceCode the source code to extract from
 * @returns a list of tokens to be ignored
 */
function extractTokens(sourceCode) {
    const jsxTokens = [];
    const importTokens = [];
    const requireTokens = [];
    (0, visitor_1.visit)(sourceCode, (node) => {
        var _a;
        const tsNode = node;
        switch (tsNode.type) {
            case 'JSXAttribute':
                if (((_a = tsNode.value) === null || _a === void 0 ? void 0 : _a.type) === 'Literal') {
                    jsxTokens.push(...sourceCode.getTokens(tsNode.value));
                }
                break;
            case 'ImportDeclaration':
                importTokens.push(...sourceCode.getTokens(tsNode));
                break;
            case 'CallExpression':
                if (tsNode.callee.type === 'Identifier' && tsNode.callee.name === 'require') {
                    requireTokens.push(...sourceCode.getTokens(tsNode));
                }
                break;
        }
    });
    return { jsxTokens, importTokens, requireTokens };
}
function isStringLiteralToken(token) {
    return token.value.startsWith('"') || token.value.startsWith("'") || token.value.startsWith('`');
}
//# sourceMappingURL=cpd.js.map