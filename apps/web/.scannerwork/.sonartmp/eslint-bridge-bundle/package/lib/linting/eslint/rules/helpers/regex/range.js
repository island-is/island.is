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
exports.getRegexpRange = void 0;
const helpers_1 = require("linting/eslint/rules/helpers");
const tokenizer_1 = require("./tokenizer");
/**
 * Returns the location of regexpNode relative to the node, which is regexp string or literal. If the computation
 * of location fails, it returns the range of the whole node.
 */
function getRegexpRange(node, regexpNode) {
    if ((0, helpers_1.isRegexLiteral)(node)) {
        return [regexpNode.start, regexpNode.end];
    }
    if ((0, helpers_1.isStringLiteral)(node)) {
        if (node.value === '') {
            return [0, 2];
        }
        const s = node.raw;
        const tokens = (0, tokenizer_1.tokenizeString)(unquote(s));
        if (regexpNode.start === regexpNode.end) {
            // this happens in case of empty alternative node like '|'
            if (regexpNode.start - 1 < tokens.length) {
                // '|' first empty alternative will have start = 1, end = 1
                // +1 is to account for string quote
                return [
                    tokens[regexpNode.start - 1].range[0] + 1,
                    tokens[regexpNode.start - 1].range[0] + 1,
                ];
            }
            else {
                // '|' second empty alternative regex node will have start = 2, end = 2
                // +1 is to account for string quote
                return [(0, helpers_1.last)(tokens).range[1] + 1, (0, helpers_1.last)(tokens).range[1] + 1];
            }
        }
        // regexpNode positions are 1 - based, we need to -1 to report as 0 - based
        // it's possible for node start to be outside of range, e.g. `a` in new RegExp('//a')
        const startToken = regexpNode.start - 1;
        if (tokens[startToken] === undefined) {
            // fallback when something is broken
            return nodeRange(node);
        }
        const start = tokens[startToken].range[0];
        // it's possible for node end to be outside of range, e.g. new RegExp('\n(|)')
        const endToken = Math.min(regexpNode.end - 2, tokens.length - 1);
        if (tokens[endToken] === undefined) {
            // fallback when something is broken
            return nodeRange(node);
        }
        const end = tokens[endToken].range[1];
        // +1 is needed to account for string quotes
        return [start + 1, end + 1];
    }
    if (node.type === 'TemplateLiteral') {
        // we don't support these properly
        return nodeRange(node);
    }
    throw new Error(`Expected regexp or string literal, got ${node.type}`);
}
exports.getRegexpRange = getRegexpRange;
function nodeRange(node) {
    return [0, node.range[1] - node.range[0]];
}
function unquote(s) {
    if (s.charAt(0) !== "'" && s.charAt(0) !== '"') {
        throw new Error(`invalid string to unquote: ${s}`);
    }
    return s.substring(1, s.length - 1);
}
//# sourceMappingURL=range.js.map