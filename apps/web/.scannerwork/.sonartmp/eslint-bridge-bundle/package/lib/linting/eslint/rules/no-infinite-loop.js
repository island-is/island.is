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
// https://sonarsource.github.io/rspec/#/rspec/S2189/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const eslint_1 = require("eslint");
const eslint_2 = require("linting/eslint");
const helpers_1 = require("./decorators/helpers");
const helpers_2 = require("./helpers");
const linter = new eslint_1.Linter();
const noUnmodifiedLoopEslint = (0, helpers_1.interceptReport)(linter.getRules().get('no-unmodified-loop-condition'), onReport);
const MESSAGE = "Correct this loop's end condition to not be invariant.";
exports.rule = {
    // we copy the meta to have proper messageId
    meta: noUnmodifiedLoopEslint.meta,
    create(context) {
        const noUnmodifiedLoopListener = noUnmodifiedLoopEslint.create(context);
        return {
            WhileStatement: (node) => {
                checkWhileStatement(node, context);
            },
            DoWhileStatement: (node) => {
                checkWhileStatement(node, context);
            },
            ForStatement: (node) => {
                const forStatement = node;
                if (!forStatement.test ||
                    (forStatement.test.type === 'Literal' && forStatement.test.value === true)) {
                    const hasEndCondition = LoopVisitor.hasEndCondition(forStatement.body, context);
                    if (!hasEndCondition) {
                        const firstToken = context.getSourceCode().getFirstToken(node);
                        context.report({
                            loc: firstToken.loc,
                            message: MESSAGE,
                        });
                    }
                }
            },
            'Program:exit'() {
                // @ts-ignore
                noUnmodifiedLoopListener['Program:exit']();
            },
        };
    },
};
function checkWhileStatement(node, context) {
    const whileStatement = node;
    if (whileStatement.test.type === 'Literal' && whileStatement.test.value === true) {
        const hasEndCondition = LoopVisitor.hasEndCondition(whileStatement.body, context);
        if (!hasEndCondition) {
            const firstToken = context.getSourceCode().getFirstToken(node);
            context.report({ loc: firstToken.loc, message: MESSAGE });
        }
    }
}
function onReport(context, reportDescriptor) {
    if ('node' in reportDescriptor) {
        const node = reportDescriptor['node'];
        if ((0, helpers_2.isUndefined)(node)) {
            return;
        }
        context.report(reportDescriptor);
    }
}
class LoopVisitor {
    constructor() {
        this.hasEndCondition = false;
    }
    static hasEndCondition(node, context) {
        const visitor = new LoopVisitor();
        visitor.visit(node, context);
        return visitor.hasEndCondition;
    }
    visit(root, context) {
        const visitNode = (node, isNestedLoop = false) => {
            switch (node.type) {
                case 'WhileStatement':
                case 'DoWhileStatement':
                case 'ForStatement':
                    isNestedLoop = true;
                    break;
                case 'FunctionExpression':
                case 'FunctionDeclaration':
                    // Don't consider nested functions
                    return;
                case 'BreakStatement':
                    if (!isNestedLoop || !!node.label) {
                        this.hasEndCondition = true;
                    }
                    break;
                case 'YieldExpression':
                case 'ReturnStatement':
                case 'ThrowStatement':
                    this.hasEndCondition = true;
                    return;
            }
            (0, eslint_2.childrenOf)(node, context.getSourceCode().visitorKeys).forEach(child => visitNode(child, isNestedLoop));
        };
        visitNode(root);
    }
}
//# sourceMappingURL=no-infinite-loop.js.map