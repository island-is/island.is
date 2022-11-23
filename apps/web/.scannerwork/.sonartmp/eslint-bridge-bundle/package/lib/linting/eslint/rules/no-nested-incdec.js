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
// https://sonarsource.github.io/rspec/#/rspec/S881/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    meta: {
        messages: {
            extractOperation: 'Extract this {{incrementType}} operation into a dedicated statement.',
        },
    },
    create(context) {
        function reportUpdateExpression(node) {
            context.report({
                messageId: 'extractOperation',
                data: {
                    incrementType: node.operator === '++' ? 'increment' : 'decrement',
                },
                node,
            });
        }
        return {
            UpdateExpression(node) {
                if (!isIgnored(node, context.getAncestors())) {
                    reportUpdateExpression(node);
                }
            },
        };
    },
};
function isIgnored(node, ancestors) {
    const firstAncestor = ancestors.pop();
    if (firstAncestor) {
        switch (firstAncestor.type) {
            case 'ExpressionStatement':
                return true;
            case 'ForStatement':
                return firstAncestor.update === node;
            case 'SequenceExpression': {
                const secondAncestor = ancestors.pop();
                return (secondAncestor !== undefined &&
                    secondAncestor.type === 'ForStatement' &&
                    secondAncestor.update === firstAncestor);
            }
        }
    }
    return false;
}
//# sourceMappingURL=no-nested-incdec.js.map