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
// https://sonarsource.github.io/rspec/#/rspec/S3616/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            specifyCase: `Explicitly specify {{nesting}} separate cases that fall through; currently this case clause only works for "{{expression}}".`,
        },
    },
    create(context) {
        function reportIssue(node, clause, nestingLvl) {
            context.report({
                messageId: 'specifyCase',
                data: {
                    nesting: nestingLvl.toString(),
                    expression: String(getTextFromNode(clause)),
                },
                node,
            });
        }
        function getTextFromNode(node) {
            if (node.type === 'Literal') {
                return node.value;
            }
            else {
                return context.getSourceCode().getText(node);
            }
        }
        return {
            'SwitchCase > SequenceExpression': function (node) {
                const expressions = node.expressions;
                reportIssue(node, expressions[expressions.length - 1], expressions.length);
            },
            'SwitchCase > LogicalExpression': function (node) {
                if (!isSwitchTrue(getEnclosingSwitchStatement(context))) {
                    const firstElemAndNesting = getFirstElementAndNestingLevel(node, 0);
                    if (firstElemAndNesting) {
                        reportIssue(node, firstElemAndNesting[0], firstElemAndNesting[1] + 1);
                    }
                }
            },
        };
    },
};
function getEnclosingSwitchStatement(context) {
    const ancestors = context.getAncestors();
    for (let i = ancestors.length - 1; i >= 0; i--) {
        if (ancestors[i].type === 'SwitchStatement') {
            return ancestors[i];
        }
    }
    throw new Error('A switch case should have an enclosing switch statement');
}
function isSwitchTrue(node) {
    return (0, helpers_1.isLiteral)(node.discriminant) && node.discriminant.value === true;
}
function getFirstElementAndNestingLevel(logicalExpression, currentLvl) {
    if (logicalExpression.operator === '||') {
        if (logicalExpression.left.type === 'LogicalExpression') {
            return getFirstElementAndNestingLevel(logicalExpression.left, currentLvl + 1);
        }
        else {
            return [logicalExpression.left, currentLvl + 1];
        }
    }
    return undefined;
}
//# sourceMappingURL=comma-or-logical-or-case.js.map