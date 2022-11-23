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
// https://sonarsource.github.io/rspec/#/rspec/S5876/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const eslint_1 = require("linting/eslint");
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            createSession: 'Create a new session during user authentication to prevent session fixation attacks.',
        },
    },
    create(context) {
        let sessionRegenerate = false;
        function isSessionRegenerate(node) {
            return (node.type === 'CallExpression' &&
                node.callee.type === 'MemberExpression' &&
                (0, helpers_1.isIdentifier)(node.callee.property, 'regenerate'));
        }
        function visitCallback(node) {
            if (sessionRegenerate) {
                // terminate recursion once call is detected
                return;
            }
            if (isSessionRegenerate(node)) {
                sessionRegenerate = true;
                return;
            }
            (0, eslint_1.childrenOf)(node, context.getSourceCode().visitorKeys).forEach(visitCallback);
        }
        function hasSessionFalseOption(callExpression) {
            const opt = callExpression.arguments[1];
            if ((opt === null || opt === void 0 ? void 0 : opt.type) === 'ObjectExpression') {
                const sessionProp = (0, helpers_1.getPropertyWithValue)(context, opt, 'session', false);
                return !!sessionProp;
            }
            return false;
        }
        return {
            CallExpression: (node) => {
                const callExpression = node;
                if ((0, helpers_1.isCallToFQN)(context, callExpression, 'passport', 'authenticate')) {
                    if (hasSessionFalseOption(callExpression)) {
                        return;
                    }
                    const parent = (0, helpers_1.last)(context.getAncestors());
                    if (parent.type === 'CallExpression') {
                        const callback = (0, helpers_1.getValueOfExpression)(context, parent.arguments[2], 'FunctionExpression');
                        if (callback && callback.type === 'FunctionExpression') {
                            sessionRegenerate = false;
                            visitCallback(callback);
                            if (!sessionRegenerate) {
                                context.report({ node: callback, messageId: 'createSession' });
                            }
                        }
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=session-regeneration.js.map