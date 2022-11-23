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
// https://sonarsource.github.io/rspec/#/rspec/S4822/javascript
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
    },
    create(context) {
        const services = context.parserServices;
        if ((0, helpers_1.isRequiredParserServices)(services)) {
            return {
                TryStatement: (node) => visitTryStatement(node, context, services),
            };
        }
        return {};
    },
};
function visitTryStatement(tryStmt, context, services) {
    if (tryStmt.handler) {
        // without '.catch()'
        const openPromises = [];
        // with '.catch()'
        const capturedPromises = [];
        let hasPotentiallyThrowingCalls = false;
        CallLikeExpressionVisitor.getCallExpressions(tryStmt.block, context).forEach(callLikeExpr => {
            if (callLikeExpr.type === 'AwaitExpression' ||
                !(0, helpers_1.isThenable)(callLikeExpr, services)) {
                hasPotentiallyThrowingCalls = true;
                return;
            }
            if (isAwaitLike(callLikeExpr) || isThened(callLikeExpr) || isCatch(callLikeExpr)) {
                return;
            }
            (isCaught(callLikeExpr) ? capturedPromises : openPromises).push(callLikeExpr);
        });
        if (!hasPotentiallyThrowingCalls) {
            checkForWrongCatch(tryStmt, openPromises, context);
            checkForUselessCatch(tryStmt, openPromises, capturedPromises, context);
        }
    }
}
class CallLikeExpressionVisitor {
    constructor() {
        this.callLikeExpressions = [];
    }
    static getCallExpressions(node, context) {
        const visitor = new CallLikeExpressionVisitor();
        visitor.visit(node, context);
        return visitor.callLikeExpressions;
    }
    visit(root, context) {
        const visitNode = (node) => {
            switch (node.type) {
                case 'AwaitExpression':
                case 'CallExpression':
                case 'NewExpression':
                    this.callLikeExpressions.push(node);
                    break;
                case 'FunctionDeclaration':
                case 'FunctionExpression':
                case 'ArrowFunctionExpression':
                    return;
            }
            childrenOf(node, context.getSourceCode().visitorKeys).forEach(visitNode);
        };
        visitNode(root);
    }
}
function checkForWrongCatch(tryStmt, openPromises, context) {
    if (openPromises.length > 0) {
        const ending = openPromises.length > 1 ? 's' : '';
        const message = `Consider using 'await' for the promise${ending} inside this 'try' or replace it with 'Promise.prototype.catch(...)' usage${ending}.`;
        const token = context.getSourceCode().getFirstToken(tryStmt);
        context.report({
            message: (0, helpers_1.toEncodedMessage)(message, openPromises, Array(openPromises.length).fill('Promise')),
            loc: token.loc,
        });
    }
}
function checkForUselessCatch(tryStmt, openPromises, capturedPromises, context) {
    if (openPromises.length === 0 && capturedPromises.length > 0) {
        const ending = capturedPromises.length > 1 ? 's' : '';
        const message = `Consider removing this 'try' statement as promise${ending} rejection is already captured by '.catch()' method.`;
        const token = context.getSourceCode().getFirstToken(tryStmt);
        context.report({
            message: (0, helpers_1.toEncodedMessage)(message, capturedPromises, Array(capturedPromises.length).fill('Caught promise')),
            loc: token.loc,
        });
    }
}
function isAwaitLike(callExpr) {
    return (callExpr.parent &&
        (callExpr.parent.type === 'AwaitExpression' || callExpr.parent.type === 'YieldExpression'));
}
function isThened(callExpr) {
    return (callExpr.parent &&
        callExpr.parent.type === 'MemberExpression' &&
        callExpr.parent.property.type === 'Identifier' &&
        callExpr.parent.property.name === 'then');
}
function isCaught(callExpr) {
    return (callExpr.parent &&
        callExpr.parent.type === 'MemberExpression' &&
        callExpr.parent.property.type === 'Identifier' &&
        callExpr.parent.property.name === 'catch');
}
function isCatch(callExpr) {
    return (callExpr.type === 'CallExpression' &&
        callExpr.callee.type === 'MemberExpression' &&
        callExpr.callee.property.type === 'Identifier' &&
        callExpr.callee.property.name === 'catch');
}
function childrenOf(node, visitorKeys) {
    const keys = visitorKeys[node.type];
    const children = [];
    if (keys) {
        for (const key of keys) {
            const child = node[key];
            if (Array.isArray(child)) {
                children.push(...child);
            }
            else {
                children.push(child);
            }
        }
    }
    return children.filter(Boolean);
}
//# sourceMappingURL=no-try-promise.js.map