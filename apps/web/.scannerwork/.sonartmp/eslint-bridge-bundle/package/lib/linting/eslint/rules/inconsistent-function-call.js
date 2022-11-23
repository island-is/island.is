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
// https://sonarsource.github.io/rspec/#/rspec/S3686/javascript
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
        const usedInNew = new Map();
        const usedInCall = new Map();
        const hasIssue = [];
        return {
            NewExpression: (node) => {
                checkExpression(node, usedInNew, usedInCall, hasIssue, 'out', context);
            },
            CallExpression: (node) => {
                checkExpression(node, usedInCall, usedInNew, hasIssue, '', context);
            },
        };
    },
};
function checkExpression(callExpression, thisTypeUsageMap, otherTypeUsageMap, hasIssue, tail, context) {
    const variable = getVariable(callExpression, context);
    if (variable && variable.defs.length !== 0) {
        const otherTypeUsage = otherTypeUsageMap.get(variable);
        if (otherTypeUsage && otherTypeUsage.loc && !hasIssue.includes(variable)) {
            const message = `Correct the use of this function; ` +
                `on line ${otherTypeUsage.loc.start.line} it was called with${tail} "new".`;
            context.report({
                node: callExpression.callee,
                message: (0, helpers_1.toEncodedMessage)(message, [otherTypeUsage.callee]),
            });
            hasIssue.push(variable);
        }
        else {
            thisTypeUsageMap.set(variable, callExpression);
        }
    }
}
function getVariable(node, context) {
    if (node.callee.type === 'Identifier') {
        return (0, helpers_1.getVariableFromName)(context, node.callee.name);
    }
    return undefined;
}
//# sourceMappingURL=inconsistent-function-call.js.map