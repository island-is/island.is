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
// https://sonarsource.github.io/rspec/#/rspec/S3003/javascript
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
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            BinaryExpression: (node) => {
                const { operator, left, right } = node;
                if (['<', '<=', '>', '>='].includes(operator) &&
                    (0, helpers_1.isString)(left, services) &&
                    (0, helpers_1.isString)(right, services) &&
                    !isLiteralException(left) &&
                    !isLiteralException(right) &&
                    !isWithinSortCallback(context)) {
                    context.report({
                        message: (0, helpers_1.toEncodedMessage)(`Convert operands of this use of "${operator}" to number type.`, [left, right]),
                        loc: context
                            .getSourceCode()
                            .getTokensBetween(left, right)
                            .find(token => token.type === 'Punctuator' && token.value === operator).loc,
                    });
                }
            },
        };
    },
};
function isLiteralException(node) {
    return node.type === 'Literal' && node.raw.length === 3;
}
function isWithinSortCallback(context) {
    const ancestors = context.getAncestors().reverse();
    const maybeCallback = ancestors.find(node => ['ArrowFunctionExpression', 'FunctionExpression'].includes(node.type));
    if (maybeCallback) {
        const callback = maybeCallback;
        const parent = callback.parent;
        if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'CallExpression') {
            const { callee, arguments: args } = parent;
            let funcName;
            if (callee.type === 'Identifier') {
                funcName = callee.name;
            }
            else if (callee.type === 'MemberExpression' && callee.property.type === 'Identifier') {
                funcName = callee.property.name;
            }
            return funcName && funcName.match(/sort/i) && args.some(arg => arg === callback);
        }
    }
    return false;
}
//# sourceMappingURL=strings-comparison.js.map