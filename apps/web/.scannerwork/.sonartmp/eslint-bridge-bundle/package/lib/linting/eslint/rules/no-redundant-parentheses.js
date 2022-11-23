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
// https://sonarsource.github.io/rspec/#/rspec/S1110/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
        hasSuggestions: true,
    },
    create(context) {
        return {
            '*': function (node) {
                checkRedundantParentheses(context.getSourceCode(), node, context);
            },
        };
    },
};
function checkRedundantParentheses(sourceCode, node, context) {
    const parenthesesPairsAroundNode = getParenthesesPairsAround(sourceCode, node, node);
    const parent = (0, helpers_1.getParent)(context);
    // Ignore parentheses pair from the parent node
    if (!!parent && isInParentNodeParentheses(node, parent)) {
        parenthesesPairsAroundNode.pop();
    }
    // One pair of parentheses is allowed for readability purposes
    parenthesesPairsAroundNode.shift();
    parenthesesPairsAroundNode.forEach(parentheses => {
        context.report({
            message: (0, helpers_1.toEncodedMessage)(`Remove these useless parentheses.`, [
                parentheses.closingParenthesis,
            ]),
            loc: parentheses.openingParenthesis.loc,
            suggest: [
                {
                    desc: 'Remove these useless parentheses',
                    fix(fixer) {
                        return [
                            fixer.remove(parentheses.openingParenthesis),
                            fixer.remove(parentheses.closingParenthesis),
                        ];
                    },
                },
            ],
        });
    });
}
function getParenthesesPairsAround(sourceCode, start, end) {
    const tokenBefore = sourceCode.getTokenBefore(start);
    const tokenAfter = sourceCode.getTokenAfter(end);
    if (!!tokenBefore && !!tokenAfter && tokenBefore.value === '(' && tokenAfter.value === ')') {
        return [
            { openingParenthesis: tokenBefore, closingParenthesis: tokenAfter },
            ...getParenthesesPairsAround(sourceCode, tokenBefore, tokenAfter),
        ];
    }
    return [];
}
function isInParentNodeParentheses(node, parent) {
    const nodeIsInConditionOfParent = (parent.type === 'IfStatement' ||
        parent.type === 'WhileStatement' ||
        parent.type === 'DoWhileStatement') &&
        parent.test === node;
    const nodeIsArgumentOfCallExpression = (parent.type === 'CallExpression' || parent.type === 'NewExpression') &&
        parent.arguments.includes(node);
    return nodeIsInConditionOfParent || nodeIsArgumentOfCallExpression;
}
//# sourceMappingURL=no-redundant-parentheses.js.map