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
// https://sonarsource.github.io/rspec/#/rspec/S3782/javascript
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
const typescript_1 = __importStar(require("typescript"));
exports.rule = {
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        const tc = services.program.getTypeChecker();
        function isBuiltInMethod(symbol) {
            var _a;
            const parent = (_a = symbol.valueDeclaration) === null || _a === void 0 ? void 0 : _a.parent;
            if (!parent || parent.kind !== typescript_1.SyntaxKind.InterfaceDeclaration) {
                return false;
            }
            const parentSymbol = tc.getSymbolAtLocation(parent.name);
            if (!parentSymbol) {
                return false;
            }
            const fqn = tc.getFullyQualifiedName(parentSymbol);
            // some of the built-in objects are deliberately excluded, because they generate many FPs
            // and no relevant TP, e.g. RegExp, Function
            return ['String', 'Math', 'Array', 'Number', 'Date'].includes(fqn);
        }
        function isVarArg(param) {
            return !!param.dotDotDotToken;
        }
        function isTypeParameter(type) {
            return type.getFlags() & typescript_1.default.TypeFlags.TypeParameter;
        }
        function declarationMismatch(declaration, callExpression) {
            const parameters = declaration.parameters;
            for (let i = 0; i < Math.min(parameters.length, callExpression.arguments.length); i++) {
                const parameterType = parameters[i].type;
                if (!parameterType) {
                    return null;
                }
                const declaredType = tc.getTypeFromTypeNode(parameterType);
                const actualType = (0, helpers_1.getTypeFromTreeNode)(callExpression.arguments[i], services);
                if (
                // @ts-ignore private API, see https://github.com/microsoft/TypeScript/issues/9879
                !tc.isTypeAssignableTo(actualType, declaredType) &&
                    !isTypeParameter(declaredType) &&
                    !typescript_1.default.isFunctionTypeNode(parameterType) &&
                    !isVarArg(parameters[i])) {
                    return { actualType, declaredType, node: callExpression.arguments[i] };
                }
            }
            return null;
        }
        function typeToString(type) {
            return tc.typeToString(tc.getBaseTypeOfLiteralType(type));
        }
        return {
            CallExpression: (node) => {
                const callExpression = node;
                const tsCallExpr = services.esTreeNodeToTSNodeMap.get(callExpression.callee);
                const symbol = tc.getSymbolAtLocation(tsCallExpr);
                if (symbol && symbol.declarations && isBuiltInMethod(symbol)) {
                    let mismatch = null;
                    for (const declaration of symbol.declarations) {
                        mismatch = declarationMismatch(declaration, callExpression);
                        if (!mismatch) {
                            return;
                        }
                    }
                    if (mismatch) {
                        context.report({
                            node: mismatch.node,
                            message: `Verify that argument is of correct type: expected '${typeToString(mismatch.declaredType)}' instead of '${typeToString(mismatch.actualType)}'.`,
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=argument-type.js.map