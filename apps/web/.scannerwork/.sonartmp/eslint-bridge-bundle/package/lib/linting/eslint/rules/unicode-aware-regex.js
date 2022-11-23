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
// https://sonarsource.github.io/rspec/#/rspec/S5867/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const regex_1 = require("./helpers/regex");
const parameters_1 = require("linting/eslint/linter/parameters");
exports.rule = (0, regex_1.createRegExpRule)(context => {
    const unicodeProperties = [];
    const unicodeCharacters = [];
    let rawPattern;
    let isUnicodeEnabled = false;
    return {
        onRegExpLiteralEnter: (node) => {
            rawPattern = node.raw;
            isUnicodeEnabled = node.flags.unicode;
        },
        onQuantifierEnter: (quantifier) => {
            if (isUnicodeEnabled) {
                return;
            }
            /* \u{hhhh}, \u{hhhhh} */
            const { raw, min: hex } = quantifier;
            if (raw.startsWith('\\u') &&
                !raw.includes(',') &&
                ['hhhh'.length, 'hhhhh'.length].includes(hex.toString().length)) {
                unicodeCharacters.push(quantifier);
            }
        },
        onCharacterEnter: (character) => {
            if (isUnicodeEnabled) {
                return;
            }
            const c = character.raw;
            if (c !== '\\p' && c !== '\\P') {
                return;
            }
            let state = 'start';
            let offset = character.start + c.length;
            let nextChar;
            do {
                nextChar = rawPattern[offset];
                offset++;
                switch (state) {
                    case 'start':
                        if (nextChar === '{') {
                            state = 'openingBracket';
                        }
                        else {
                            state = 'end';
                        }
                        break;
                    case 'openingBracket':
                        if (/[a-zA-Z]/.test(nextChar)) {
                            state = 'alpha';
                        }
                        else {
                            state = 'end';
                        }
                        break;
                    case 'alpha':
                        if (/[a-zA-Z]/.test(nextChar)) {
                            state = 'alpha';
                        }
                        else if (nextChar === '=') {
                            state = 'equal';
                        }
                        else if (nextChar === '}') {
                            state = 'closingBracket';
                        }
                        else {
                            state = 'end';
                        }
                        break;
                    case 'equal':
                        if (/[a-zA-Z]/.test(nextChar)) {
                            state = 'alpha1';
                        }
                        else {
                            state = 'end';
                        }
                        break;
                    case 'alpha1':
                        if (/[a-zA-Z]/.test(nextChar)) {
                            state = 'alpha1';
                        }
                        else if (nextChar === '}') {
                            state = 'closingBracket';
                        }
                        else {
                            state = 'end';
                        }
                        break;
                    case 'closingBracket':
                        state = 'end';
                        unicodeProperties.push({ character, offset: offset - c.length - 1 });
                        break;
                }
            } while (state !== 'end');
        },
        onRegExpLiteralLeave: (regexp) => {
            if (!isUnicodeEnabled && (unicodeProperties.length > 0 || unicodeCharacters.length > 0)) {
                const secondaryLocations = [];
                const secondaryMessages = [];
                unicodeProperties.forEach(p => {
                    secondaryLocations.push({
                        loc: (0, regex_1.getRegexpLocation)(context.node, p.character, context, [0, p.offset]),
                    });
                    secondaryMessages.push('Unicode property');
                });
                unicodeCharacters.forEach(c => {
                    secondaryLocations.push({ loc: (0, regex_1.getRegexpLocation)(context.node, c, context) });
                    secondaryMessages.push('Unicode character');
                });
                context.reportRegExpNode({
                    message: (0, helpers_1.toEncodedMessage)(`Enable the 'u' flag for this regex using Unicode constructs.`, secondaryLocations, secondaryMessages),
                    node: context.node,
                    regexpNode: regexp,
                });
            }
        },
    };
}, {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
});
//# sourceMappingURL=unicode-aware-regex.js.map