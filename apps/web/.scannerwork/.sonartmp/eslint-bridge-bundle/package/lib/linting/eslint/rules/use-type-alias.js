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
// https://sonarsource.github.io/rspec/#/rspec/S4323/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const TYPE_THRESHOLD = 2;
const USAGE_THRESHOLD = 2;
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
        let usage;
        return {
            Program: () => (usage = new Map()),
            'Program:exit': () => usage.forEach(nodes => {
                if (nodes.length > USAGE_THRESHOLD) {
                    const [node, ...rest] = nodes;
                    const kind = node.type === 'TSUnionType' ? 'union' : 'intersection';
                    const message = (0, helpers_1.toEncodedMessage)(`Replace this ${kind} type with a type alias.`, rest, Array(rest.length).fill('Following occurrence.'));
                    context.report({ message, loc: node.loc });
                }
            }),
            'TSUnionType, TSIntersectionType': (node) => {
                const ancestors = context.getAncestors();
                const declaration = ancestors.find(ancestor => ancestor.type === 'TSTypeAliasDeclaration');
                if (!declaration) {
                    const composite = node;
                    if (composite.types.length > TYPE_THRESHOLD) {
                        const text = composite.types
                            .map(typeNode => context.getSourceCode().getText(typeNode))
                            .sort((a, b) => a.localeCompare(b))
                            .join('|');
                        let occurrences = usage.get(text);
                        if (!occurrences) {
                            occurrences = [composite];
                            usage.set(text, occurrences);
                        }
                        else {
                            occurrences.push(composite);
                        }
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=use-type-alias.js.map