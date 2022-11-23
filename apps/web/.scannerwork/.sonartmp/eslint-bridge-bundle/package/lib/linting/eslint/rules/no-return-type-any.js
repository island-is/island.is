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
// https://sonarsource.github.io/rspec/#/rspec/S4324/javascript
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
const helpers_1 = require("./helpers");
const ts = __importStar(require("typescript"));
exports.rule = {
    meta: {
        messages: {
            removeOrChangeType: 'Remove this return type or change it to a more specific.',
        },
    },
    create(context) {
        const services = context.parserServices;
        if ((0, helpers_1.isRequiredParserServices)(services)) {
            const returnedExpressions = [];
            return {
                ReturnStatement(node) {
                    if (returnedExpressions.length > 0) {
                        returnedExpressions[returnedExpressions.length - 1].push(node.argument);
                    }
                },
                FunctionDeclaration: function () {
                    returnedExpressions.push([]);
                },
                'FunctionDeclaration:exit': function (node) {
                    const returnType = node.returnType;
                    if (returnType &&
                        returnType.typeAnnotation.type === 'TSAnyKeyword' &&
                        returnedExpressions.length > 0 &&
                        allReturnTypesEqual(returnedExpressions[returnedExpressions.length - 1], services)) {
                        context.report({
                            messageId: 'removeOrChangeType',
                            loc: returnType.loc,
                        });
                    }
                    returnedExpressions.pop();
                },
            };
        }
        return {};
    },
};
function allReturnTypesEqual(returns, services) {
    const firstReturnType = getTypeFromTreeNode(returns.pop(), services);
    if (!!firstReturnType && !!isPrimitiveType(firstReturnType)) {
        return returns.every(nextReturn => {
            const nextReturnType = getTypeFromTreeNode(nextReturn, services);
            return !!nextReturnType && nextReturnType.flags === firstReturnType.flags;
        });
    }
    return false;
}
function getTypeFromTreeNode(node, services) {
    const checker = services.program.getTypeChecker();
    return checker.getTypeAtLocation(services.esTreeNodeToTSNodeMap.get(node));
}
function isPrimitiveType({ flags }) {
    return (flags & ts.TypeFlags.BooleanLike ||
        flags & ts.TypeFlags.NumberLike ||
        flags & ts.TypeFlags.StringLike ||
        flags & ts.TypeFlags.EnumLike);
}
//# sourceMappingURL=no-return-type-any.js.map