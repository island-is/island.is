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
// https://sonarsource.github.io/rspec/#/rspec/S6080/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const MESSAGE = 'Set this timeout to 0 if you want to disable it, otherwise use a value lower than 2147483648.';
const MAX_DELAY_VALUE = 2147483647;
exports.rule = {
    create(context) {
        if (!helpers_1.Chai.isImported(context)) {
            return {};
        }
        const constructs = [];
        return {
            CallExpression: (node) => {
                if (helpers_1.Mocha.isTestConstruct(node)) {
                    constructs.push(node);
                    return;
                }
                if (constructs.length > 0) {
                    checkTimeoutDisabling(node, context);
                }
            },
            'CallExpression:exit': (node) => {
                if (helpers_1.Mocha.isTestConstruct(node)) {
                    constructs.pop();
                }
            },
        };
    },
};
function checkTimeoutDisabling(node, context) {
    if ((0, helpers_1.isMethodCall)(node) && node.arguments.length > 0) {
        const { callee: { object, property }, arguments: [value], } = node;
        if ((0, helpers_1.isThisExpression)(object) &&
            (0, helpers_1.isIdentifier)(property, 'timeout') &&
            isDisablingTimeout(value, context)) {
            context.report({
                message: MESSAGE,
                node: value,
            });
        }
    }
}
function isDisablingTimeout(timeout, context) {
    const usage = (0, helpers_1.getUniqueWriteUsageOrNode)(context, timeout);
    return (0, helpers_1.isNumberLiteral)(usage) && usage.value > MAX_DELAY_VALUE;
}
//# sourceMappingURL=disabled-timeout.js.map