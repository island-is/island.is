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
// https://sonarsource.github.io/rspec/#/rspec/S1186/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportWithQuickFixIfApplicable = exports.decorateNoEmptyFunction = void 0;
const helpers_1 = require("./helpers");
const no_empty_decorator_1 = require("./no-empty-decorator");
const helpers_2 = require("../helpers");
function isRuleFunctionNode(node) {
    return (0, helpers_2.isFunctionNode)(node) && 'parent' in node;
}
// core implementation of this rule does not provide quick fixes
function decorateNoEmptyFunction(rule) {
    rule.meta.hasSuggestions = true;
    return (0, helpers_1.interceptReport)(rule, reportWithQuickFixIfApplicable);
}
exports.decorateNoEmptyFunction = decorateNoEmptyFunction;
function reportWithQuickFixIfApplicable(context, reportDescriptor) {
    if (!('node' in reportDescriptor) || !isRuleFunctionNode(reportDescriptor.node)) {
        return;
    }
    const functionNode = reportDescriptor.node;
    if (isApplicable(functionNode)) {
        reportWithQuickFix(context, reportDescriptor, functionNode);
    }
}
exports.reportWithQuickFixIfApplicable = reportWithQuickFixIfApplicable;
// This function limits the issues to variable/function/method declarations which name is not like /^on[A-Z].
// Any lambda expression or arrow function is thus ignored.
function isApplicable(functionNode) {
    // Matches identifiers like onClick and more generally onXxx
    function isCallbackIdentifier(node) {
        return node !== null && (0, helpers_2.isIdentifier)(node) && /^on[A-Z]/.test(node.name);
    }
    // Matches: function foo() {}
    // But not: function onClose() {}
    function isFunctionDeclaration() {
        return functionNode.type === 'FunctionDeclaration' && !isCallbackIdentifier(functionNode.id);
    }
    // Matches: class A { foo() {} }
    // But not: class A { onClose() {} }
    function isMethodDefinition() {
        const methodNode = functionNode.parent;
        return (methodNode.type === 'MethodDefinition' &&
            methodNode.value === functionNode &&
            !isCallbackIdentifier(methodNode.key));
    }
    // Matches: const foo = () => {};
    // But not: const onClose = () => {};
    function isVariableDeclarator() {
        const variableNode = functionNode.parent;
        return (variableNode.type === 'VariableDeclarator' &&
            variableNode.init === functionNode &&
            !isCallbackIdentifier(variableNode.id));
    }
    return isFunctionDeclaration() || isMethodDefinition() || isVariableDeclarator();
}
function reportWithQuickFix(context, reportDescriptor, func) {
    const name = reportDescriptor.data.name;
    const openingBrace = context.getSourceCode().getFirstToken(func.body);
    const closingBrace = context.getSourceCode().getLastToken(func.body);
    (0, no_empty_decorator_1.suggestEmptyBlockQuickFix)(context, reportDescriptor, name, openingBrace, closingBrace);
}
//# sourceMappingURL=no-empty-function-decorator.js.map