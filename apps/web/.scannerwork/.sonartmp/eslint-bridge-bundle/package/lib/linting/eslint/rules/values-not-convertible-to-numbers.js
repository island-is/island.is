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
// https://sonarsource.github.io/rspec/#/rspec/S3758/javascript
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
const comparisonOperators = new Set(['>', '<', '>=', '<=']);
exports.rule = {
    meta: {
        messages: {
            reEvaluateDataFlow: 'Re-evaluate the data flow; this operand of a numeric comparison could be of type {{type}}.',
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            BinaryExpression(node) {
                const { left, operator, right } = node;
                if (!comparisonOperators.has(operator)) {
                    return;
                }
                if (left.type === 'MemberExpression' || right.type === 'MemberExpression') {
                    // avoid FPs on field access
                    return;
                }
                const checker = services.program.getTypeChecker();
                const leftType = (0, helpers_1.getTypeFromTreeNode)(left, services);
                const rightType = (0, helpers_1.getTypeFromTreeNode)(right, services);
                if ((0, helpers_1.isStringType)(leftType) || (0, helpers_1.isStringType)(rightType)) {
                    return;
                }
                const isLeftConvertibleToNumber = isConvertibleToNumber(leftType, checker);
                const isRightConvertibleToNumber = isConvertibleToNumber(rightType, checker);
                if (!isLeftConvertibleToNumber) {
                    context.report({
                        messageId: 'reEvaluateDataFlow',
                        data: {
                            type: checker.typeToString(leftType),
                        },
                        node: left,
                    });
                }
                if (!isRightConvertibleToNumber) {
                    context.report({
                        messageId: 'reEvaluateDataFlow',
                        data: {
                            type: checker.typeToString(rightType),
                        },
                        node: right,
                    });
                }
            },
        };
    },
};
function isConvertibleToNumber(typ, checker) {
    const flags = typ.getFlags();
    if ((flags & ts.TypeFlags.BooleanLike) !== 0) {
        return true;
    }
    if ((flags & ts.TypeFlags.Undefined) !== 0) {
        return false;
    }
    const valueOfSignatures = getValueOfSignatures(typ, checker);
    return (valueOfSignatures.length === 0 ||
        valueOfSignatures.some(signature => isNumberLike(signature.getReturnType())));
}
function getValueOfSignatures(typ, checker) {
    const valueOfSymbol = typ.getProperty('valueOf');
    if (!valueOfSymbol) {
        return [];
    }
    const declarations = valueOfSymbol.getDeclarations() || [];
    return declarations
        .map(declaration => checker.getTypeAtLocation(declaration).getCallSignatures())
        .reduce((result, decl) => result.concat(decl), []);
}
function isNumberLike(typ) {
    return (typ.getFlags() & ts.TypeFlags.NumberLike) !== 0;
}
//# sourceMappingURL=values-not-convertible-to-numbers.js.map