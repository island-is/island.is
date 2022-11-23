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
// https://sonarsource.github.io/rspec/#/rspec/S1523/javascript
// SQ key 'eval'
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    meta: {
        messages: {
            safeCode: 'Make sure that this dynamic injection or execution of code is safe.',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => checkCallExpression(node, context),
            NewExpression: (node) => checkCallExpression(node, context),
        };
    },
};
function checkCallExpression(node, context) {
    if (node.callee.type === 'Identifier') {
        const { name } = node.callee;
        if ((name === 'eval' || name === 'Function') && hasAtLeastOneVariableArgument(node.arguments)) {
            context.report({
                messageId: 'safeCode',
                node: node.callee,
            });
        }
    }
}
function hasAtLeastOneVariableArgument(args) {
    return !!args.find(arg => !isLiteral(arg));
}
function isLiteral(node) {
    if (node.type === 'Literal') {
        return true;
    }
    if (node.type === 'TemplateLiteral') {
        return node.expressions.length === 0;
    }
    return false;
}
//# sourceMappingURL=code-eval.js.map