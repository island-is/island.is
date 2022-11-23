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
// https://sonarsource.github.io/rspec/#/rspec/S5725/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            safeResource: 'Make sure not using resource integrity feature is safe here.',
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        function shouldReport(assignedVariable) {
            let nbSrcAssignment = 0;
            let hasUnsafeSrcAssignment = false;
            let hasIntegrityAssignment = false;
            assignedVariable.references.forEach(ref => {
                const parentNode = ref.identifier.parent;
                if (!parentNode) {
                    return;
                }
                nbSrcAssignment += isSrcAssignment(parentNode) ? 1 : 0;
                hasUnsafeSrcAssignment = hasUnsafeSrcAssignment || isUnsafeSrcAssignment(parentNode);
                hasIntegrityAssignment = hasIntegrityAssignment || isIntegrityAssignment(parentNode);
            });
            return nbSrcAssignment === 1 && hasUnsafeSrcAssignment && !hasIntegrityAssignment;
        }
        function isIntegrityAssignment(memberExpression) {
            if (memberExpression.type !== 'MemberExpression') {
                return false;
            }
            return (memberExpression.property.type === 'Identifier' &&
                memberExpression.property.name === 'integrity');
        }
        function isSrcAssignment(memberExpression) {
            if (memberExpression.type !== 'MemberExpression') {
                return false;
            }
            if (memberExpression.property.type !== 'Identifier' ||
                memberExpression.property.name !== 'src') {
                return false;
            }
            const assignmentExpression = memberExpression.parent;
            if ((assignmentExpression === null || assignmentExpression === void 0 ? void 0 : assignmentExpression.type) !== 'AssignmentExpression') {
                return false;
            }
            return true;
        }
        function isUnsafeSrcAssignment(memberExpression) {
            if (!isSrcAssignment(memberExpression)) {
                return false;
            }
            const right = memberExpression.parent.right;
            if (right.type !== 'Literal') {
                return false;
            }
            return !!right.raw && (!!right.raw.match('^"http') || !!right.raw.match('^"//'));
        }
        return {
            'VariableDeclarator[init.type="CallExpression"]': (node) => {
                const variableDeclarator = node;
                const callExpression = variableDeclarator.init;
                const left = variableDeclarator.id;
                const { callee } = callExpression;
                if (left.type !== 'Identifier') {
                    return;
                }
                if (callee.type !== 'MemberExpression') {
                    return;
                }
                const typeName = (0, helpers_1.getTypeAsString)(left, services);
                if (!(0, helpers_1.isIdentifier)(callee.object, 'document') ||
                    !(0, helpers_1.isIdentifier)(callee.property, 'createElement') ||
                    typeName !== 'HTMLScriptElement') {
                    return;
                }
                const scope = context.getScope();
                const assignedVariable = scope.variables.find(v => v.name === left.name);
                if (!assignedVariable) {
                    return;
                }
                if (shouldReport(assignedVariable)) {
                    context.report({
                        node: variableDeclarator,
                        messageId: 'safeResource',
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=disabled-resource-integrity.js.map