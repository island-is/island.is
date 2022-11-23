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
// https://sonarsource.github.io/rspec/#/rspec/S3834/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const SYMBOL = 'Symbol';
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
        function isSymbol(node) {
            return node.type === 'Identifier' && node.name === SYMBOL;
        }
        function isShadowed(_node) {
            const variable = (0, helpers_1.getVariableFromName)(context, SYMBOL);
            return variable && variable.defs.length > 0;
        }
        return {
            NewExpression: (node) => {
                const { callee } = node;
                if (isSymbol(callee) && !isShadowed(callee)) {
                    const newToken = context
                        .getSourceCode()
                        .getFirstToken(node, token => token.value === 'new');
                    context.report({
                        message: (0, helpers_1.toEncodedMessage)(`Remove this "new" operator.`, [callee]),
                        loc: newToken.loc,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=no-new-symbol.js.map