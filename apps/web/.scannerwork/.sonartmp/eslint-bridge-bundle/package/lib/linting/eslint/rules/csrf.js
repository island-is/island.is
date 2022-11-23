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
// https://sonarsource.github.io/rspec/#/rspec/S4502/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const CSURF_MODULE = 'csurf';
const SAFE_METHODS = ['GET', 'HEAD', 'OPTIONS'];
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
        let globalCsrfProtection = false;
        let importedCsrfMiddleware = false;
        function checkIgnoredMethods(node) {
            if (node.value.type === 'ArrayExpression') {
                const arrayExpr = node.value;
                const unsafeMethods = arrayExpr.elements
                    .filter(helpers_1.isLiteral)
                    .filter(e => typeof e.value === 'string' && !SAFE_METHODS.includes(e.value));
                if (unsafeMethods.length > 0) {
                    const [first, ...rest] = unsafeMethods;
                    context.report({
                        message: (0, helpers_1.toEncodedMessage)('Make sure disabling CSRF protection is safe here.', rest),
                        node: first,
                    });
                }
            }
        }
        function isCsurfMiddleware(node) {
            if ((node === null || node === void 0 ? void 0 : node.type) === 'Identifier') {
                node = (0, helpers_1.getUniqueWriteUsage)(context, node.name);
            }
            if (node && node.type === 'CallExpression' && node.callee.type === 'Identifier') {
                const module = (0, helpers_1.getModuleNameOfIdentifier)(context, node.callee);
                return (module === null || module === void 0 ? void 0 : module.value) === CSURF_MODULE;
            }
            return false;
        }
        function checkCallExpression(callExpression) {
            const { callee } = callExpression;
            // require('csurf')
            const requiredModule = (0, helpers_1.getModuleNameFromRequire)(callExpression);
            if ((requiredModule === null || requiredModule === void 0 ? void 0 : requiredModule.value) === CSURF_MODULE) {
                importedCsrfMiddleware = true;
            }
            // csurf(...)
            if (callee.type === 'Identifier') {
                const moduleName = (0, helpers_1.getModuleNameOfIdentifier)(context, callee);
                if ((moduleName === null || moduleName === void 0 ? void 0 : moduleName.value) === CSURF_MODULE) {
                    const [args] = callExpression.arguments;
                    const ignoredMethods = (0, helpers_1.getObjectExpressionProperty)(args, 'ignoreMethods');
                    if (ignoredMethods) {
                        checkIgnoredMethods(ignoredMethods);
                    }
                }
            }
            // app.use(csurf(...))
            if (callee.type === 'MemberExpression') {
                if ((0, helpers_1.isIdentifier)(callee.property, 'use') &&
                    (0, helpers_1.flattenArgs)(context, callExpression.arguments).find(isCsurfMiddleware)) {
                    globalCsrfProtection = true;
                }
                if ((0, helpers_1.isIdentifier)(callee.property, 'post', 'put', 'delete', 'patch') &&
                    !globalCsrfProtection &&
                    importedCsrfMiddleware &&
                    !callExpression.arguments.some(arg => isCsurfMiddleware(arg))) {
                    context.report({
                        message: (0, helpers_1.toEncodedMessage)('Make sure not using CSRF protection is safe here.', []),
                        node: callee,
                    });
                }
            }
        }
        return {
            Program() {
                globalCsrfProtection = false;
            },
            CallExpression(node) {
                checkCallExpression(node);
            },
            ImportDeclaration(node) {
                if (node.source.value === CSURF_MODULE) {
                    importedCsrfMiddleware = true;
                }
            },
        };
    },
};
//# sourceMappingURL=csrf.js.map