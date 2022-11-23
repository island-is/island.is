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
// https://sonarsource.github.io/rspec/#/rspec/S4784/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const stringMethods = ['match', 'search', 'split'];
const minPatternLength = 3;
const specialChars = ['+', '*', '{'];
exports.rule = {
    meta: {
        messages: {
            safeRegex: 'Make sure that using a regular expression is safe here.',
        },
    },
    create(context) {
        return {
            Literal(node) {
                const { regex } = node;
                if (regex) {
                    const { pattern } = regex;
                    if (isUnsafeRegexLiteral(pattern)) {
                        context.report({
                            messageId: 'safeRegex',
                            node,
                        });
                    }
                }
            },
            CallExpression(node) {
                const { callee, arguments: args } = node;
                if ((0, helpers_1.isMemberWithProperty)(callee, ...stringMethods)) {
                    checkFirstArgument(args, context);
                }
            },
            NewExpression(node) {
                const { callee, arguments: args } = node;
                if ((0, helpers_1.isIdentifier)(callee, 'RegExp')) {
                    checkFirstArgument(args, context);
                }
            },
        };
    },
};
function checkFirstArgument(args, context) {
    const firstArg = args[0];
    if (firstArg &&
        firstArg.type === 'Literal' &&
        typeof firstArg.value === 'string' &&
        isUnsafeRegexLiteral(firstArg.value)) {
        context.report({
            messageId: 'safeRegex',
            node: firstArg,
        });
    }
}
function isUnsafeRegexLiteral(value) {
    return value.length >= minPatternLength && hasEnoughNumberOfSpecialChars(value);
}
function hasEnoughNumberOfSpecialChars(value) {
    let numberOfSpecialChars = 0;
    for (const c of value) {
        if (specialChars.includes(c)) {
            numberOfSpecialChars++;
        }
        if (numberOfSpecialChars === 2) {
            return true;
        }
    }
    return false;
}
//# sourceMappingURL=regular-expr.js.map