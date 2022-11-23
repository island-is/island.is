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
// https://sonarsource.github.io/rspec/#/rspec/S5667/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const eslint_1 = require("linting/eslint");
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
        const MESSAGE = 'Enable server hostname verification on this SSL/TLS connection.';
        const SECONDARY_MESSAGE = 'Set "rejectUnauthorized" to "true".';
        function checkSensitiveArgument(callExpression, sensitiveArgumentIndex) {
            if (callExpression.arguments.length < sensitiveArgumentIndex + 1) {
                return;
            }
            const sensitiveArgument = callExpression.arguments[sensitiveArgumentIndex];
            const secondaryLocations = [];
            const secondaryMessages = [];
            let shouldReport = false;
            const argumentValue = (0, helpers_1.getValueOfExpression)(context, sensitiveArgument, 'ObjectExpression');
            if (!argumentValue) {
                return;
            }
            if (sensitiveArgument !== argumentValue) {
                secondaryLocations.push(argumentValue);
                secondaryMessages.push(undefined);
            }
            const unsafeRejectUnauthorizedConfiguration = (0, helpers_1.getPropertyWithValue)(context, argumentValue, 'rejectUnauthorized', false);
            if (unsafeRejectUnauthorizedConfiguration) {
                secondaryLocations.push(unsafeRejectUnauthorizedConfiguration);
                secondaryMessages.push(SECONDARY_MESSAGE);
                shouldReport = true;
            }
            const checkServerIdentityProperty = (0, helpers_1.getObjectExpressionProperty)(argumentValue, 'checkServerIdentity');
            if (checkServerIdentityProperty &&
                shouldReportOnCheckServerIdentityCallBack(checkServerIdentityProperty)) {
                secondaryLocations.push(checkServerIdentityProperty);
                secondaryMessages.push(undefined);
                shouldReport = true;
            }
            if (shouldReport) {
                context.report({
                    node: callExpression.callee,
                    message: (0, helpers_1.toEncodedMessage)(MESSAGE, secondaryLocations, secondaryMessages),
                });
            }
        }
        function shouldReportOnCheckServerIdentityCallBack(checkServerIdentityProperty) {
            let baseFunction;
            baseFunction = (0, helpers_1.getValueOfExpression)(context, checkServerIdentityProperty.value, 'FunctionExpression');
            if (!baseFunction) {
                baseFunction = (0, helpers_1.getValueOfExpression)(context, checkServerIdentityProperty.value, 'ArrowFunctionExpression');
            }
            if ((baseFunction === null || baseFunction === void 0 ? void 0 : baseFunction.body.type) === 'BlockStatement') {
                const returnStatements = ReturnStatementsVisitor.getReturnStatements(baseFunction.body, context);
                if (returnStatements.length === 0 ||
                    returnStatements.every(r => {
                        var _a;
                        return (!r.argument || ((_a = (0, helpers_1.getValueOfExpression)(context, r.argument, 'Literal')) === null || _a === void 0 ? void 0 : _a.value) === true);
                    })) {
                    return true;
                }
            }
            return false;
        }
        return {
            CallExpression: (node) => {
                const callExpression = node;
                if ((0, helpers_1.isCallToFQN)(context, callExpression, 'https', 'request')) {
                    checkSensitiveArgument(callExpression, 0);
                }
                if ((0, helpers_1.isCallToFQN)(context, callExpression, 'request', 'get')) {
                    checkSensitiveArgument(callExpression, 0);
                }
                if ((0, helpers_1.isCallToFQN)(context, callExpression, 'tls', 'connect')) {
                    checkSensitiveArgument(callExpression, 2);
                }
            },
        };
    },
};
class ReturnStatementsVisitor {
    constructor() {
        this.returnStatements = [];
    }
    static getReturnStatements(node, context) {
        const visitor = new ReturnStatementsVisitor();
        visitor.visit(node, context);
        return visitor.returnStatements;
    }
    visit(root, context) {
        const visitNode = (node) => {
            switch (node.type) {
                case 'ReturnStatement':
                    this.returnStatements.push(node);
                    break;
                case 'FunctionDeclaration':
                case 'FunctionExpression':
                case 'ArrowFunctionExpression':
                    return;
            }
            (0, eslint_1.childrenOf)(node, context.getSourceCode().visitorKeys).forEach(visitNode);
        };
        visitNode(root);
    }
}
//# sourceMappingURL=unverified-hostname.js.map