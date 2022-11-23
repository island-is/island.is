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
// https://sonarsource.github.io/rspec/#/rspec/S5759/javascript
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
        return {
            CallExpression(node) {
                const call = node;
                const { callee, arguments: args } = call;
                if (isSensitiveFQN(context, call) && args.length > 0) {
                    const xfwdProp = (0, helpers_1.getObjectExpressionProperty)(args[0], 'xfwd');
                    if (!xfwdProp) {
                        return;
                    }
                    const xfwdValue = (0, helpers_1.getValueOfExpression)(context, xfwdProp.value, 'Literal');
                    if ((xfwdValue === null || xfwdValue === void 0 ? void 0 : xfwdValue.value) === true) {
                        context.report({
                            node: callee,
                            message: (0, helpers_1.toEncodedMessage)('Make sure forwarding client IP address is safe here.', [
                                xfwdProp,
                            ]),
                        });
                    }
                }
            },
        };
    },
};
function isSensitiveFQN(context, call) {
    var _a, _b;
    const { callee } = call;
    if (callee.type === 'MemberExpression') {
        return ((0, helpers_1.isCallToFQN)(context, call, 'http-proxy', 'createProxyServer') ||
            (0, helpers_1.isCallToFQN)(context, call, 'http-proxy-middleware', 'createProxyMiddleware'));
    }
    return (((0, helpers_1.isIdentifier)(callee, 'createProxyServer') &&
        ((_a = (0, helpers_1.getModuleNameOfNode)(context, callee)) === null || _a === void 0 ? void 0 : _a.value) === 'http-proxy') ||
        ((0, helpers_1.isIdentifier)(callee, 'createProxyMiddleware') &&
            ((_b = (0, helpers_1.getModuleNameOfNode)(context, callee)) === null || _b === void 0 ? void 0 : _b.value) === 'http-proxy-middleware'));
}
//# sourceMappingURL=no-ip-forward.js.map