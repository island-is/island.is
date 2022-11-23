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
// https://sonarsource.github.io/rspec/#/rspec/S2970/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const assertionFunctions = [
    'a',
    'an',
    'include',
    'includes',
    'contain',
    'contains',
    'equal',
    'equals',
    'eq',
    'eql',
    'eqls',
    'above',
    'gt',
    'greaterThan',
    'least',
    'gte',
    'below',
    'lt',
    'lessThan',
    'most',
    'lte',
    'within',
    'instanceof',
    'instanceOf',
    'property',
    'ownPropertyDescriptor',
    'haveOwnPropertyDescriptor',
    'lengthOf',
    'length',
    'match',
    'matches',
    'string',
    'key',
    'keys',
    'throw',
    'throws',
    'Throw',
    'respondTo',
    'respondsTo',
    'satisfy',
    'satisfies',
    'closeTo',
    'approximately',
    'members',
    'oneOf',
    'change',
    'changes',
    'increase',
    'increases',
    'decrease',
    'decreases',
    'by',
    'fail',
];
const gettersOrModifiers = [
    'to',
    'be',
    'been',
    'is',
    'that',
    'which',
    'and',
    'has',
    'have',
    'with',
    'at',
    'of',
    'same',
    'but',
    'does',
    'still',
    // Modifier functions
    'not',
    'deep',
    'nested',
    'own',
    'ordered',
    'any',
    'all',
    'itself',
    'should',
];
exports.rule = {
    create(context) {
        return {
            ExpressionStatement(node) {
                const exprStatement = node;
                if (exprStatement.expression.type === 'MemberExpression') {
                    const { property } = exprStatement.expression;
                    if (isTestAssertion(exprStatement.expression)) {
                        if ((0, helpers_1.isIdentifier)(property, ...assertionFunctions)) {
                            context.report({
                                node: property,
                                message: `Call this '${property.name}' assertion.`,
                            });
                        }
                        if ((0, helpers_1.isIdentifier)(property, ...gettersOrModifiers)) {
                            context.report({
                                node: property,
                                message: `Complete this assertion; '${property.name}' doesn't assert anything by itself.`,
                            });
                        }
                    }
                }
                if (isExpectCall(exprStatement.expression)) {
                    const { callee } = exprStatement.expression;
                    context.report({
                        node: callee,
                        message: `Complete this assertion; '${callee.name}' doesn't assert anything by itself.`,
                    });
                }
            },
        };
    },
};
function isTestAssertion(node) {
    const { object, property } = node;
    // Chai's BDD style where 'should' extends Object.prototype https://www.chaijs.com/guide/styles/
    if ((0, helpers_1.isIdentifier)(object) && (0, helpers_1.isIdentifier)(property, 'should')) {
        return true;
    }
    if (isExpectCall(object) || (0, helpers_1.isIdentifier)(object, 'assert', 'expect', 'should')) {
        return true;
    }
    else if (object.type === 'MemberExpression') {
        return isTestAssertion(object);
    }
    else if (object.type === 'CallExpression' && object.callee.type === 'MemberExpression') {
        return isTestAssertion(object.callee);
    }
    return false;
}
function isExpectCall(node) {
    return (node.type === 'CallExpression' &&
        (0, helpers_1.isIdentifier)(node.callee, 'expect') &&
        !(0, helpers_1.isNumberLiteral)(node.arguments[0]));
}
//# sourceMappingURL=no-incomplete-assertions.js.map