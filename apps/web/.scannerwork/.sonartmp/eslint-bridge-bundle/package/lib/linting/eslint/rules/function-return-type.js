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
// https://sonarsource.github.io/rspec/#/rspec/S3800/javascript
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
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const ts = __importStar(require("typescript"));
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
class FunctionScope {
    constructor() {
        this.returnStatements = [];
    }
    getReturnStatements() {
        return this.returnStatements.slice();
    }
    addReturnStatement(node) {
        this.returnStatements.push(node);
    }
}
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
        let scopes = [];
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        const checker = services.program.getTypeChecker();
        function onFunctionExit(node) {
            const returnStatements = scopes.pop().getReturnStatements();
            if (returnStatements.every(retStmt => { var _a; return ((_a = retStmt.argument) === null || _a === void 0 ? void 0 : _a.type) === 'ThisExpression'; })) {
                return;
            }
            const signature = checker.getSignatureFromDeclaration(services.esTreeNodeToTSNodeMap.get(node));
            if (signature && hasMultipleReturnTypes(signature, checker)) {
                const stmts = returnStatements.filter(retStmt => !isNullLike((0, helpers_1.getTypeFromTreeNode)(retStmt.argument, services)));
                const stmtsTypes = stmts.map(retStmt => (0, helpers_1.getTypeFromTreeNode)(retStmt.argument, services));
                if (stmtsTypes.every(helpers_1.isAny)) {
                    return;
                }
                context.report({
                    message: (0, helpers_1.toEncodedMessage)('Refactor this function to always return the same type.', stmts, stmtsTypes.map(stmtType => `Returns ${prettyPrint(stmtType, checker)}`)),
                    loc: (0, locations_1.getMainFunctionTokenLocation)(node, (0, helpers_1.getParent)(context), context),
                });
            }
        }
        return {
            ReturnStatement: (node) => {
                const retStmt = node;
                if (scopes.length > 0 && retStmt.argument) {
                    scopes[scopes.length - 1].addReturnStatement(retStmt);
                }
            },
            ':function': () => {
                scopes.push(new FunctionScope());
            },
            ':function:exit': onFunctionExit,
            'Program:exit': () => {
                scopes = [];
            },
        };
    },
};
function hasMultipleReturnTypes(signature, checker) {
    const returnType = checker.getBaseTypeOfLiteralType(checker.getReturnTypeOfSignature(signature));
    return isMixingTypes(returnType, checker) && !hasReturnTypeJSDoc(signature);
}
function isMixingTypes(type, checker) {
    return (type.isUnion() &&
        type.types
            .filter(tp => !isNullLike(tp))
            .map(tp => prettyPrint(tp, checker))
            .filter(distinct).length > 1);
}
function hasReturnTypeJSDoc(signature) {
    return signature.getJsDocTags().some(tag => ['return', 'returns'].includes(tag.name));
}
function isObjectLikeType(type) {
    return !!(type.getFlags() & ts.TypeFlags.Object);
}
function distinct(value, index, self) {
    return self.indexOf(value) === index;
}
function prettyPrint(type, checker) {
    if (type.isUnionOrIntersection()) {
        const delimiter = type.isUnion() ? ' | ' : ' & ';
        return type.types
            .map(tp => prettyPrint(tp, checker))
            .filter(distinct)
            .join(delimiter);
    }
    const typeNode = checker.typeToTypeNode(type, undefined, undefined);
    if (typeNode !== undefined) {
        if (ts.isFunctionTypeNode(typeNode)) {
            return 'function';
        }
        if (ts.isArrayTypeNode(typeNode) || isTypedArray(type, checker)) {
            return 'array';
        }
    }
    if (isObjectLikeType(type)) {
        return 'object';
    }
    return checker.typeToString(checker.getBaseTypeOfLiteralType(type));
}
function isTypedArray(type, checker) {
    return checker.typeToString(type).endsWith('Array');
}
function isNullLike(type) {
    return ((type.flags & ts.TypeFlags.Null) !== 0 ||
        (type.flags & ts.TypeFlags.Void) !== 0 ||
        (type.flags & ts.TypeFlags.Undefined) !== 0);
}
//# sourceMappingURL=function-return-type.js.map