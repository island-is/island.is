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
// https://sonarsource.github.io/rspec/#/rspec/S5856/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const regexpp_1 = require("regexpp");
const validator = new regexpp_1.RegExpValidator();
exports.rule = {
    create(context) {
        function getFlags(node) {
            if (node.arguments.length < 2) {
                return '';
            }
            if ((0, helpers_1.isStringLiteral)(node.arguments[1])) {
                return node.arguments[1].value;
            }
            return null;
        }
        function validateRegExpPattern(pattern, uFlag) {
            try {
                validator.validatePattern(pattern, undefined, undefined, uFlag);
                return null;
            }
            catch (err) {
                return err.message;
            }
        }
        function validateRegExpFlags(flags) {
            try {
                validator.validateFlags(flags);
                return null;
            }
            catch (_a) {
                return `Invalid flags supplied to RegExp constructor '${flags}'`;
            }
        }
        function isRegExpConstructor(call) {
            const { callee } = call;
            return callee.type === 'Identifier' && callee.name === 'RegExp';
        }
        function isStringMatch(call) {
            const services = context.parserServices;
            if (!(0, helpers_1.isRequiredParserServices)(services)) {
                return false;
            }
            const { callee } = call;
            return (callee.type === 'MemberExpression' &&
                (0, helpers_1.isStringType)((0, helpers_1.getTypeFromTreeNode)(callee.object, services)) &&
                (0, helpers_1.isIdentifier)(callee.property, 'match'));
        }
        function getPattern(call) {
            if ((0, helpers_1.isStringLiteral)(call.arguments[0])) {
                return call.arguments[0].value;
            }
            return null;
        }
        return {
            'CallExpression, NewExpression'(node) {
                const call = node;
                if (!isRegExpConstructor(call) && !isStringMatch(call)) {
                    return;
                }
                const pattern = getPattern(call);
                if (!pattern) {
                    return;
                }
                const flags = getFlags(call);
                const message = (flags && validateRegExpFlags(flags)) ||
                    // If flags are unknown, report the regex only if its pattern is invalid both with and without the "u" flag
                    (flags === null
                        ? validateRegExpPattern(pattern, true) && validateRegExpPattern(pattern, false)
                        : validateRegExpPattern(pattern, flags.includes('u')));
                if (message) {
                    context.report({
                        node,
                        message,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=sonar-no-invalid-regexp.js.map