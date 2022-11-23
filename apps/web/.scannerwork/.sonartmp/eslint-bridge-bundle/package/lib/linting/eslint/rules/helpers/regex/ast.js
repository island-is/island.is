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
exports.isStringRegexMethodCall = exports.isStringReplaceCall = exports.isRegExpConstructor = void 0;
const helpers_1 = require("linting/eslint/rules/helpers");
function isRegExpConstructor(node) {
    return (((node.type === 'CallExpression' || node.type === 'NewExpression') &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'RegExp' &&
        node.arguments.length > 0) ||
        isRegExpWithGlobalThis(node));
}
exports.isRegExpConstructor = isRegExpConstructor;
function isStringReplaceCall(call, services) {
    return (call.callee.type === 'MemberExpression' &&
        call.callee.property.type === 'Identifier' &&
        !call.callee.computed &&
        ['replace', 'replaceAll'].includes(call.callee.property.name) &&
        call.arguments.length > 1 &&
        (0, helpers_1.isString)(call.callee.object, services));
}
exports.isStringReplaceCall = isStringReplaceCall;
function isStringRegexMethodCall(call, services) {
    return (call.callee.type === 'MemberExpression' &&
        call.callee.property.type === 'Identifier' &&
        !call.callee.computed &&
        ['match', 'matchAll', 'search'].includes(call.callee.property.name) &&
        call.arguments.length > 0 &&
        (0, helpers_1.isString)(call.callee.object, services) &&
        (0, helpers_1.isString)(call.arguments[0], services));
}
exports.isStringRegexMethodCall = isStringRegexMethodCall;
function isRegExpWithGlobalThis(node) {
    return (node.type === 'NewExpression' &&
        node.callee.type === 'MemberExpression' &&
        (0, helpers_1.isIdentifier)(node.callee.object, 'globalThis') &&
        (0, helpers_1.isIdentifier)(node.callee.property, 'RegExp') &&
        node.arguments.length > 0);
}
//# sourceMappingURL=ast.js.map