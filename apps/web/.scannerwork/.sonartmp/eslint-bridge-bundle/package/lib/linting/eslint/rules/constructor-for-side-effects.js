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
// https://sonarsource.github.io/rspec/#/rspec/S1848/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            removeInstantiationOf: 'Either remove this useless object instantiation of "{{constructor}}" or use it.',
            removeInstantiation: 'Either remove this useless object instantiation or use it.',
        },
    },
    create(context) {
        const sourceCode = context.getSourceCode();
        return {
            'ExpressionStatement > NewExpression': (node) => {
                if ((0, helpers_1.isTestCode)(context) || isTryable(node, context)) {
                    return;
                }
                const callee = node.callee;
                if (callee.type === 'Identifier' || callee.type === 'MemberExpression') {
                    const calleeText = sourceCode.getText(callee);
                    const reportLocation = {
                        start: node.loc.start,
                        end: callee.loc.end,
                    };
                    reportIssue(reportLocation, `${calleeText}`, 'removeInstantiationOf', context);
                }
                else {
                    const newToken = sourceCode.getFirstToken(node);
                    reportIssue(newToken.loc, '', 'removeInstantiation', context);
                }
            },
        };
    },
};
function isTryable(node, context) {
    const ancestors = context.getAncestors();
    let parent = undefined;
    let child = node;
    while ((parent = ancestors.pop()) !== undefined) {
        if (parent.type === 'TryStatement' && parent.block === child) {
            return true;
        }
        child = parent;
    }
    return false;
}
function reportIssue(loc, objectText, messageId, context) {
    context.report({
        messageId,
        data: {
            constructor: objectText,
        },
        loc,
    });
}
//# sourceMappingURL=constructor-for-side-effects.js.map