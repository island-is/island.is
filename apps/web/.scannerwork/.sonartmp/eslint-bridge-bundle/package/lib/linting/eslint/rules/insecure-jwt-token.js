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
// https://sonarsource.github.io/rspec/#/rspec/S5659/javascript
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
        const SIGN_MESSAGE = 'Use only strong cipher algorithms when signing this JWT.';
        const VERIFY_MESSAGE = 'Use only strong cipher algorithms when verifying the signature of this JWT.';
        const SECONDARY_MESSAGE = `The "algorithms" option should be defined and should not contain 'none'.`;
        function checkCallToSign(callExpression, thirdArgumentValue, secondaryLocations) {
            const unsafeAlgorithmProperty = (0, helpers_1.getPropertyWithValue)(context, thirdArgumentValue, 'algorithm', 'none');
            if (unsafeAlgorithmProperty) {
                const unsafeAlgorithmValue = (0, helpers_1.getValueOfExpression)(context, unsafeAlgorithmProperty.value, 'Literal');
                if (unsafeAlgorithmValue && unsafeAlgorithmValue !== unsafeAlgorithmProperty.value) {
                    secondaryLocations.push(unsafeAlgorithmValue);
                }
                raiseIssueOn(callExpression.callee, SIGN_MESSAGE, secondaryLocations);
            }
        }
        function checkCallToVerify(callExpression, publicKey, thirdArgumentValue, secondaryLocations) {
            const algorithmsProperty = (0, helpers_1.getObjectExpressionProperty)(thirdArgumentValue, 'algorithms');
            if (!algorithmsProperty) {
                if ((0, helpers_1.isNullLiteral)(publicKey)) {
                    raiseIssueOn(callExpression.callee, VERIFY_MESSAGE, secondaryLocations);
                }
                return;
            }
            const algorithmsValue = (0, helpers_1.getValueOfExpression)(context, algorithmsProperty.value, 'ArrayExpression');
            if (!algorithmsValue) {
                return;
            }
            const algorithmsContainNone = algorithmsValue.elements.some(e => {
                const value = (0, helpers_1.getValueOfExpression)(context, e, 'Literal');
                return (value === null || value === void 0 ? void 0 : value.value) === 'none';
            });
            if (algorithmsContainNone) {
                if (algorithmsProperty.value !== algorithmsValue) {
                    secondaryLocations.push(algorithmsValue);
                }
                raiseIssueOn(callExpression.callee, VERIFY_MESSAGE, secondaryLocations);
            }
        }
        function raiseIssueOn(node, message, secondaryLocations) {
            context.report({
                node,
                message: (0, helpers_1.toEncodedMessage)(message, secondaryLocations, Array(secondaryLocations.length).fill(SECONDARY_MESSAGE)),
            });
        }
        return {
            CallExpression: (node) => {
                const callExpression = node;
                const isCallToSign = (0, helpers_1.isCallToFQN)(context, callExpression, 'jsonwebtoken', 'sign');
                const isCallToVerify = (0, helpers_1.isCallToFQN)(context, callExpression, 'jsonwebtoken', 'verify');
                if (!isCallToSign && !isCallToVerify) {
                    return;
                }
                if (callExpression.arguments.length < 3) {
                    // algorithm(s) property is contained in third argument of "sign" and "verify" calls
                    return;
                }
                const thirdArgument = callExpression.arguments[2];
                const thirdArgumentValue = (0, helpers_1.getValueOfExpression)(context, thirdArgument, 'ObjectExpression');
                if (!thirdArgumentValue) {
                    return;
                }
                const secondaryLocations = [thirdArgumentValue];
                if (thirdArgumentValue !== thirdArgument) {
                    secondaryLocations.push(thirdArgument);
                }
                if (isCallToSign) {
                    checkCallToSign(callExpression, thirdArgumentValue, secondaryLocations);
                }
                const secondArgument = callExpression.arguments[1];
                if (isCallToVerify) {
                    checkCallToVerify(callExpression, secondArgument, thirdArgumentValue, secondaryLocations);
                }
            },
        };
    },
};
//# sourceMappingURL=insecure-jwt-token.js.map