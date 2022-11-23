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
// https://sonarsource.github.io/rspec/#/rspec/S4830/javascript
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
        const MESSAGE = 'Enable server certificate validation on this SSL/TLS connection.';
        const SECONDARY_MESSAGE = 'Set "rejectUnauthorized" to "true".';
        function checkSensitiveArgument(callExpression, sensitiveArgumentIndex) {
            if (callExpression.arguments.length < sensitiveArgumentIndex + 1) {
                return;
            }
            const sensitiveArgument = callExpression.arguments[sensitiveArgumentIndex];
            const secondaryLocations = [];
            const secondaryMessages = [];
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
                context.report({
                    node: callExpression.callee,
                    message: (0, helpers_1.toEncodedMessage)(MESSAGE, secondaryLocations, secondaryMessages),
                });
            }
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
//# sourceMappingURL=unverified-certificate.js.map