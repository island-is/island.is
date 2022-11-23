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
// https://sonarsource.github.io/rspec/#/rspec/S2392/javascript
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
        let scopeRanges = [];
        let reported = [];
        function enterScope(node) {
            scopeRanges.push(node.range);
        }
        function exitScope() {
            scopeRanges.pop();
        }
        return {
            Program(node) {
                scopeRanges = [node.range];
                reported = [];
            },
            BlockStatement: enterScope,
            'BlockStatement:exit': exitScope,
            ForStatement: enterScope,
            'ForStatement:exit': exitScope,
            ForInStatement: enterScope,
            'ForInStatement:exit': exitScope,
            ForOfStatement: enterScope,
            'ForOfStatement:exit': exitScope,
            SwitchStatement: enterScope,
            'SwitchStatement:exit': exitScope,
            VariableDeclaration: (node) => {
                const varDeclaration = node;
                if (varDeclaration.kind !== 'var') {
                    return;
                }
                const scopeRange = scopeRanges[scopeRanges.length - 1];
                function isOutsideOfScope(reference) {
                    const idRange = reference.range;
                    return idRange[0] < scopeRange[0] || idRange[1] > scopeRange[1];
                }
                context.getDeclaredVariables(node).forEach(variable => {
                    const referencesOutside = variable.references
                        .map(ref => ref.identifier)
                        .filter(isOutsideOfScope);
                    if (referencesOutside.length === 0) {
                        return;
                    }
                    const definition = variable.defs.find(def => varDeclaration.declarations.includes(def.node));
                    if (definition && !reported.includes(definition.name)) {
                        context.report({
                            node: definition.name,
                            message: (0, helpers_1.toEncodedMessage)(`Consider moving declaration of '${variable.name}' ` +
                                `as it is referenced outside current binding context.`, referencesOutside, Array(referencesOutside.length).fill('Outside reference.')),
                        });
                        variable.defs.map(def => def.name).forEach(defId => reported.push(defId));
                    }
                });
            },
        };
    },
};
//# sourceMappingURL=sonar-block-scoped-var.js.map