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
// https://sonarsource.github.io/rspec/#/rspec/S2068/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            reviewCredential: 'Review this potentially hardcoded credential.',
        },
    },
    create(context) {
        const variableNames = context.options;
        const literalRegExp = variableNames.map(name => new RegExp(`${name}=.+`));
        return {
            VariableDeclarator: (node) => {
                const declaration = node;
                checkAssignment(context, variableNames, declaration.id, declaration.init);
            },
            AssignmentExpression: (node) => {
                const assignment = node;
                checkAssignment(context, variableNames, assignment.left, assignment.right);
            },
            Property: (node) => {
                const property = node;
                checkAssignment(context, variableNames, property.key, property.value);
            },
            Literal: (node) => {
                const literal = node;
                checkLiteral(context, literalRegExp, literal);
            },
        };
    },
};
function checkAssignment(context, patterns, variable, initializer) {
    if (initializer &&
        (0, helpers_1.isStringLiteral)(initializer) &&
        initializer.value.length > 0 &&
        patterns.some(pattern => context.getSourceCode().getText(variable).includes(pattern))) {
        context.report({
            messageId: 'reviewCredential',
            node: initializer,
        });
    }
}
function checkLiteral(context, patterns, literal) {
    if ((0, helpers_1.isStringLiteral)(literal) && patterns.some(pattern => pattern.test(literal.value))) {
        context.report({
            messageId: 'reviewCredential',
            node: literal,
        });
    }
}
//# sourceMappingURL=no-hardcoded-credentials.js.map