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
// https://sonarsource.github.io/rspec/#/rspec/S1994/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const equivalence_1 = require("eslint-plugin-sonarjs/lib/utils/equivalence");
const helpers_1 = require("./helpers");
class ForInfo {
    constructor(forLoop) {
        this.forLoop = forLoop;
        this.updatedExpressions = [];
        this.testedExpressions = [];
    }
}
exports.rule = {
    meta: {
        messages: {
            misplacedCounter: `This loop's stop condition tests "{{test}}" but the incrementer updates "{{update}}".`,
        },
    },
    create(context) {
        const forLoopStack = [];
        function join(expressions) {
            return expressions.map(expr => context.getSourceCode().getText(expr)).join(', ');
        }
        function isInsideUpdate(node) {
            return isInside(node, f => f.update);
        }
        function isInsideTest(node) {
            return isInside(node, f => f.test);
        }
        function isInside(node, getChild) {
            if (forLoopStack.length > 0) {
                const currentLoop = peekFor();
                const parentChain = context.getAncestors();
                parentChain.push(node);
                const forLoopChild = getChild(currentLoop.forLoop);
                if (forLoopChild) {
                    return parentChain.some(parentChainNode => forLoopChild === parentChainNode);
                }
            }
            return false;
        }
        function peekFor() {
            return forLoopStack[forLoopStack.length - 1];
        }
        return {
            ForStatement: (node) => {
                forLoopStack.push(new ForInfo(node));
            },
            'ForStatement:exit': () => {
                const forInfo = forLoopStack.pop();
                if (forInfo.updatedExpressions.length === 0 || !forInfo.forLoop.test) {
                    return;
                }
                const hasIntersection = forInfo.testedExpressions.some(testedExpr => forInfo.updatedExpressions.some(updatedExpr => (0, equivalence_1.areEquivalent)(updatedExpr, testedExpr, context.getSourceCode())));
                if (!hasIntersection) {
                    context.report({
                        loc: context.getSourceCode().getFirstToken(forInfo.forLoop).loc,
                        messageId: 'misplacedCounter',
                        data: {
                            test: join(forInfo.testedExpressions),
                            update: join(forInfo.updatedExpressions),
                        },
                    });
                }
            },
            'ForStatement AssignmentExpression': (node) => {
                if (isInsideUpdate(node)) {
                    const left = node.left;
                    const assignedExpressions = [];
                    computeAssignedExpressions(left, assignedExpressions);
                    const { updatedExpressions } = peekFor();
                    assignedExpressions.forEach(ass => updatedExpressions.push(ass));
                }
            },
            'ForStatement UpdateExpression': (node) => {
                if (isInsideUpdate(node)) {
                    peekFor().updatedExpressions.push(node.argument);
                }
            },
            'ForStatement CallExpression': (node) => {
                if (!isInsideUpdate(node)) {
                    return;
                }
                const callee = getCalleeObject(node);
                if (callee) {
                    peekFor().updatedExpressions.push(callee);
                }
            },
            'ForStatement Identifier': (node) => {
                if (isInsideTest(node)) {
                    const parent = (0, helpers_1.getParent)(context);
                    if (parent.type !== 'MemberExpression' || parent.computed || parent.object === node) {
                        peekFor().testedExpressions.push(node);
                    }
                }
            },
            'ForStatement MemberExpression': (node) => {
                if (isInsideTest(node) &&
                    (0, helpers_1.getParent)(context).type !== 'MemberExpression' &&
                    (0, helpers_1.getParent)(context).type !== 'CallExpression') {
                    peekFor().testedExpressions.push(node);
                }
            },
        };
    },
};
function getCalleeObject(node) {
    let callee = node.callee;
    while (callee.type === 'MemberExpression') {
        callee = callee.object;
    }
    if (callee.type === 'Identifier' && callee !== node.callee) {
        return callee;
    }
    return null;
}
function computeAssignedExpressions(node, assigned) {
    switch (node === null || node === void 0 ? void 0 : node.type) {
        case 'ArrayPattern':
            node.elements.forEach(element => computeAssignedExpressions(element, assigned));
            break;
        case 'ObjectPattern':
            node.properties.forEach(property => computeAssignedExpressions(property, assigned));
            break;
        case 'Property':
            computeAssignedExpressions(node.value, assigned);
            break;
        case 'AssignmentPattern':
            computeAssignedExpressions(node.left, assigned);
            break;
        default:
            assigned.push(node);
    }
}
//# sourceMappingURL=misplaced-loop-counter.js.map