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
// https://sonarsource.github.io/rspec/#/rspec/S3513/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const MESSAGE = "Use the rest syntax to declare this function's arguments.";
const SECONDARY_MESSAGE = 'Replace this reference to "arguments".';
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
            // Ignore root scope containing global variables
            'Program:exit': () => context
                .getScope()
                .childScopes.forEach(child => checkArgumentsUsageInScopeRecursively(context, child)),
        };
    },
};
function checkArgumentsUsageInScopeRecursively(context, scope) {
    scope.variables
        .filter(variable => variable.name === 'arguments')
        .forEach(variable => checkArgumentsVariableWithoutDefinition(context, variable));
    scope.childScopes.forEach(child => checkArgumentsUsageInScopeRecursively(context, child));
}
function checkArgumentsVariableWithoutDefinition(context, variable) {
    // if variable is a parameter, variable.defs contains one ParameterDefinition with a type: 'Parameter'
    // if variable is a local variable, variable.defs contains one Definition with a type: 'Variable'
    // but if variable is the function arguments, variable.defs is just empty without other hint
    const isLocalVariableOrParameter = variable.defs.length > 0;
    const references = variable.references.filter(ref => !isFollowedByLengthProperty(ref));
    if (!isLocalVariableOrParameter && references.length > 0) {
        const firstReference = references[0];
        const secondaryLocations = references.slice(1).map(ref => ref.identifier);
        context.report({
            node: firstReference.identifier,
            message: (0, helpers_1.toEncodedMessage)(MESSAGE, secondaryLocations, Array(secondaryLocations.length).fill(SECONDARY_MESSAGE)),
        });
    }
}
function isFollowedByLengthProperty(reference) {
    const parent = reference.identifier.parent;
    return (!!parent &&
        parent.type === 'MemberExpression' &&
        parent.property.type === 'Identifier' &&
        parent.property.name === 'length');
}
//# sourceMappingURL=arguments-usage.js.map