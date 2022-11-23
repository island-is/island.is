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
// https://sonarsource.github.io/rspec/#/rspec/S2137/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const illegalNames = ['eval', 'arguments', 'undefined', 'NaN', 'Infinity'];
const getDeclarationIssue = (redeclareType) => (name) => ({
    messageId: 'forbidDeclaration',
    data: { symbol: name, type: redeclareType },
});
const getModificationIssue = (functionName) => ({
    messageId: 'removeModification',
    data: { symbol: functionName },
});
exports.rule = {
    meta: {
        messages: {
            removeModification: 'Remove the modification of "{{symbol}}".',
            forbidDeclaration: 'Do not use "{{symbol}}" to declare a {{type}} - use another name.',
        },
    },
    create(context) {
        return {
            'FunctionDeclaration, FunctionExpression': function (node) {
                const func = node;
                reportBadUsageOnFunction(func, func.id, context);
            },
            ArrowFunctionExpression: function (node) {
                reportBadUsageOnFunction(node, undefined, context);
            },
            VariableDeclaration(node) {
                node.declarations.forEach(decl => {
                    reportBadUsage(decl.id, getDeclarationIssue('variable'), context);
                });
            },
            UpdateExpression(node) {
                reportBadUsage(node.argument, getModificationIssue, context);
            },
            AssignmentExpression(node) {
                reportBadUsage(node.left, getModificationIssue, context);
            },
            CatchClause(node) {
                reportBadUsage(node.param, getDeclarationIssue('variable'), context);
            },
        };
    },
};
function reportBadUsageOnFunction(func, id, context) {
    reportBadUsage(id, getDeclarationIssue('function'), context);
    func.params.forEach(p => {
        reportBadUsage(p, getDeclarationIssue('parameter'), context);
    });
}
function reportBadUsage(node, buildMessageAndData, context) {
    if (node) {
        switch (node.type) {
            case 'Identifier': {
                if (illegalNames.includes(node.name)) {
                    context.report({
                        node: node,
                        ...buildMessageAndData(node.name),
                    });
                }
                break;
            }
            case 'RestElement':
                reportBadUsage(node.argument, buildMessageAndData, context);
                break;
            case 'ObjectPattern':
                node.properties.forEach(prop => {
                    if (prop.type === 'Property') {
                        reportBadUsage(prop.value, buildMessageAndData, context);
                    }
                    else {
                        reportBadUsage(prop.argument, buildMessageAndData, context);
                    }
                });
                break;
            case 'ArrayPattern':
                node.elements.forEach(elem => {
                    reportBadUsage(elem, buildMessageAndData, context);
                });
                break;
            case 'AssignmentPattern':
                reportBadUsage(node.left, buildMessageAndData, context);
                break;
        }
    }
}
//# sourceMappingURL=no-globals-shadowing.js.map