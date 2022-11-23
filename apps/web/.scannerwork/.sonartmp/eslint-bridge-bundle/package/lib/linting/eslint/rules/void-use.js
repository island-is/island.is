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
// https://sonarsource.github.io/rspec/#/rspec/S3735/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            removeVoid: 'Remove this use of the "void" operator.',
        },
    },
    create(context) {
        const services = context.parserServices;
        function checkNode(node) {
            const unaryExpression = node;
            if (isVoid0(unaryExpression) || isIIFE(unaryExpression) || isPromiseLike(unaryExpression)) {
                return;
            }
            const operatorToken = context.getSourceCode().getTokenBefore(unaryExpression.argument);
            context.report({
                loc: operatorToken.loc,
                messageId: 'removeVoid',
            });
        }
        function isVoid0(expr) {
            return expr.argument.type === 'Literal' && 0 === expr.argument.value;
        }
        function isIIFE(expr) {
            return (expr.argument.type === 'CallExpression' &&
                ['ArrowFunctionExpression', 'FunctionExpression'].includes(expr.argument.callee.type));
        }
        function isPromiseLike(expr) {
            return (0, helpers_1.isRequiredParserServices)(services) && (0, helpers_1.isThenable)(expr.argument, services);
        }
        return {
            'UnaryExpression[operator="void"]': checkNode,
        };
    },
};
//# sourceMappingURL=void-use.js.map