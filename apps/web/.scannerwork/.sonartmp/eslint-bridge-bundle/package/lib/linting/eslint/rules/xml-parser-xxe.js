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
// https://sonarsource.github.io/rspec/#/rspec/S2755/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const XML_LIBRARY = 'libxmljs';
const XML_PARSERS = ['parseXml', 'parseXmlString'];
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
        function isXmlParserCall(call) {
            return (((call.callee.type === 'Identifier' && XML_PARSERS.includes(call.callee.name)) ||
                (call.callee.type === 'MemberExpression' &&
                    call.callee.property.type === 'Identifier' &&
                    XML_PARSERS.includes(call.callee.property.name))) &&
                call.arguments.length > 1);
        }
        function isXmlLibraryInScope() {
            return isXmlLibraryImported() || isXmlLibraryRequired();
        }
        function isXmlLibraryImported() {
            return (0, helpers_1.getImportDeclarations)(context).findIndex(i => i.source.value === XML_LIBRARY) > -1;
        }
        function isXmlLibraryRequired() {
            return ((0, helpers_1.getRequireCalls)(context).findIndex(r => r.arguments[0].type === 'Literal' && r.arguments[0].value === XML_LIBRARY) > -1);
        }
        function isNoEntSet(property) {
            return property.value.type === 'Literal' && property.value.raw === 'true';
        }
        return {
            CallExpression: (node) => {
                const call = node;
                if (isXmlParserCall(call) && isXmlLibraryInScope()) {
                    const noent = (0, helpers_1.getObjectExpressionProperty)(call.arguments[1], 'noent');
                    if (noent && isNoEntSet(noent)) {
                        context.report({
                            message: (0, helpers_1.toEncodedMessage)('Disable access to external entities in XML parsing.', [
                                call.callee,
                            ]),
                            node: noent,
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=xml-parser-xxe.js.map