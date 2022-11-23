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
// https://sonarsource.github.io/rspec/#/rspec/S1526/javascript
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
        return {
            "VariableDeclaration[kind='var']": (node) => {
                const variables = context.getDeclaredVariables(node);
                for (const variable of variables) {
                    const declaration = variable.identifiers[0];
                    const misused = variable.references
                        .filter(reference => !reference.init && comesBefore(reference.identifier, declaration))
                        .map(reference => reference.identifier);
                    if (misused.length > 0) {
                        context.report({
                            message: (0, helpers_1.toEncodedMessage)(`Move the declaration of \"${declaration.name}\" before this usage.`, [declaration], ['Declaration']),
                            node: misused[0],
                        });
                    }
                }
            },
        };
    },
};
function comesBefore(node, other) {
    const nodeLine = line(node), otherLine = line(other);
    return nodeLine < otherLine || (nodeLine === otherLine && column(node) < column(other));
}
function line(node) {
    return node.loc.start.line;
}
function column(node) {
    return node.loc.start.column;
}
//# sourceMappingURL=no-variable-usage-before-declaration.js.map