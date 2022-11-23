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
// https://sonarsource.github.io/rspec/#/rspec/S2871/javascript
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const ts = __importStar(require("typescript"));
const helpers_1 = require("./helpers");
const compareFunctionPlaceholder = '(a, b) => (a - b)';
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            provideCompareFunction: 'Provide a compare function to avoid sorting elements alphabetically.',
            suggestCompareFunction: 'Add a comparator function to sort in ascending order',
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            CallExpression: (node) => {
                const call = node;
                const callee = call.callee;
                if (call.arguments.length === 0 && callee.type === 'MemberExpression') {
                    const { object, property } = callee;
                    const text = context.getSourceCode().getText(property);
                    if (helpers_1.sortLike.includes(text)) {
                        const arrayElementType = arrayElementTypeOf(object, services);
                        if (arrayElementType && arrayElementType.kind === ts.SyntaxKind.NumberKeyword) {
                            const closingParenthesis = context
                                .getSourceCode()
                                .getLastToken(node, token => token.value === ')');
                            context.report({
                                messageId: 'provideCompareFunction',
                                node: property,
                                suggest: [
                                    {
                                        messageId: 'suggestCompareFunction',
                                        fix: fixer => fixer.insertTextBefore(closingParenthesis, compareFunctionPlaceholder),
                                    },
                                ],
                            });
                        }
                    }
                }
            },
        };
    },
};
function arrayElementTypeOf(node, services) {
    const { typeToTypeNode, getTypeAtLocation } = services.program.getTypeChecker();
    const typeNode = typeToTypeNode(getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node)), undefined, undefined);
    if (typeNode && ts.isArrayTypeNode(typeNode)) {
        return typeNode.elementType;
    }
    return undefined;
}
//# sourceMappingURL=no-alphabetical-sort.js.map