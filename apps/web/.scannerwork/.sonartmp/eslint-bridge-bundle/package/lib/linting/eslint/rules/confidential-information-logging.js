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
// https://sonarsource.github.io/rspec/#/rspec/S5757/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const MESSAGE = 'Make sure confidential information is not logged here.';
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
        return {
            NewExpression: (node) => {
                var _a, _b;
                const newExpression = node;
                const { callee } = newExpression;
                let isSignaleCall = false;
                if (callee.type !== 'MemberExpression') {
                    isSignaleCall =
                        ((_a = (0, helpers_1.getModuleNameOfNode)(context, callee)) === null || _a === void 0 ? void 0 : _a.value) === 'signale' &&
                            (0, helpers_1.isIdentifier)(callee, 'Signale');
                }
                else {
                    isSignaleCall =
                        ((_b = (0, helpers_1.getModuleNameOfNode)(context, callee.object)) === null || _b === void 0 ? void 0 : _b.value) === 'signale' &&
                            (0, helpers_1.isIdentifier)(callee.property, 'Signale');
                }
                if (!isSignaleCall) {
                    return;
                }
                if (newExpression.arguments.length === 0) {
                    context.report({ node: callee, message: (0, helpers_1.toEncodedMessage)(MESSAGE, []) });
                    return;
                }
                const firstArgument = (0, helpers_1.getValueOfExpression)(context, newExpression.arguments[0], 'ObjectExpression');
                if (!firstArgument) {
                    // Argument exists but its value is unknown
                    return;
                }
                const secrets = (0, helpers_1.getObjectExpressionProperty)(firstArgument, 'secrets');
                if (secrets &&
                    secrets.value.type === 'ArrayExpression' &&
                    secrets.value.elements.length === 0) {
                    context.report({
                        node: callee,
                        message: (0, helpers_1.toEncodedMessage)(MESSAGE, [secrets]),
                    });
                }
                else if (!secrets) {
                    context.report({
                        node: callee,
                        message: (0, helpers_1.toEncodedMessage)(MESSAGE, [firstArgument]),
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=confidential-information-logging.js.map