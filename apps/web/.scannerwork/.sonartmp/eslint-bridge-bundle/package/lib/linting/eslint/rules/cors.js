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
// https://sonarsource.github.io/rspec/#/rspec/S5122/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
const parameters_1 = require("linting/eslint/linter/parameters");
const MESSAGE = `Make sure that enabling CORS is safe here.`;
const CORS_HEADER = 'Access-Control-Allow-Origin';
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
        function report(node, ...secondaryLocations) {
            const message = (0, helpers_1.toEncodedMessage)(MESSAGE, secondaryLocations);
            context.report({ message, node });
        }
        function isCorsCall(callee) {
            var _a;
            return ((_a = (0, helpers_1.getModuleNameOfNode)(context, callee)) === null || _a === void 0 ? void 0 : _a.value) === 'cors';
        }
        return {
            CallExpression(node) {
                const call = node;
                const { callee } = call;
                if (isCorsCall(callee)) {
                    if (call.arguments.length === 0) {
                        report(call);
                        return;
                    }
                    const [arg] = call.arguments;
                    let sensitiveCorsProperty = getSensitiveCorsProperty(arg);
                    if (sensitiveCorsProperty) {
                        report(sensitiveCorsProperty);
                    }
                    if ((arg === null || arg === void 0 ? void 0 : arg.type) === 'Identifier') {
                        const usage = (0, helpers_1.getUniqueWriteUsage)(context, arg.name);
                        sensitiveCorsProperty = getSensitiveCorsProperty(usage);
                        if (sensitiveCorsProperty) {
                            report(sensitiveCorsProperty, arg);
                        }
                    }
                }
                if (isSettingCorsHeader(call)) {
                    report(call);
                }
            },
            ObjectExpression(node) {
                const objProperty = (0, helpers_1.getObjectExpressionProperty)(node, CORS_HEADER);
                if (objProperty && isAnyDomain(objProperty.value)) {
                    report(objProperty);
                }
            },
        };
    },
};
function isCorsHeader(node) {
    const header = node;
    return (0, nodes_1.isLiteral)(header) && header.value === CORS_HEADER;
}
function isAnyDomain(node) {
    const domain = node;
    return (0, nodes_1.isLiteral)(domain) && domain.value === '*';
}
function getSensitiveCorsProperty(node) {
    const originProperty = (0, helpers_1.getObjectExpressionProperty)(node, 'origin');
    if (originProperty && isAnyDomain(originProperty.value)) {
        return originProperty;
    }
    return undefined;
}
function isSettingCorsHeader(call) {
    return isCorsHeader(call.arguments[0]) && isAnyDomain(call.arguments[1]);
}
//# sourceMappingURL=cors.js.map