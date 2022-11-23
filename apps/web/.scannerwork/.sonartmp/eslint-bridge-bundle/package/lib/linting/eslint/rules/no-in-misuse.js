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
// https://sonarsource.github.io/rspec/#/rspec/S4619/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            inMisuse: 'Use "indexOf" or "includes" (available from ES2016) instead.',
            suggestIndexOf: 'Replace with "indexOf" method',
            suggestIncludes: 'Replace with "includes" method',
        },
    },
    create(context) {
        const services = context.parserServices;
        function prototypeProperty(node) {
            const expr = node;
            if (!(0, nodes_1.isLiteral)(expr) || typeof expr.value !== 'string') {
                return false;
            }
            return ['indexOf', 'lastIndexOf', 'forEach', 'map', 'filter', 'every', 'some'].includes(expr.value);
        }
        if ((0, helpers_1.isRequiredParserServices)(services)) {
            return {
                "BinaryExpression[operator='in']": (node) => {
                    const { left, right } = node;
                    if ((0, helpers_1.isArray)(right, services) && !prototypeProperty(left) && !(0, helpers_1.isNumber)(left, services)) {
                        const leftText = context.getSourceCode().getText(left);
                        const rightText = context.getSourceCode().getText(right);
                        context.report({
                            messageId: 'inMisuse',
                            node,
                            suggest: [
                                {
                                    messageId: 'suggestIndexOf',
                                    fix: fixer => fixer.replaceText(node, `${rightText}.indexOf(${leftText}) > -1`),
                                },
                                {
                                    messageId: 'suggestIncludes',
                                    fix: fixer => fixer.replaceText(node, `${rightText}.includes(${leftText})`),
                                },
                            ],
                        });
                    }
                },
            };
        }
        return {};
    },
};
//# sourceMappingURL=no-in-misuse.js.map