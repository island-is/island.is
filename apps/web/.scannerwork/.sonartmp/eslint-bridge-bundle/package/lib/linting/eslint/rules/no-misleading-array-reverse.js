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
// https://sonarsource.github.io/rspec/#/rspec/S4043/javascript
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
const arrayMutatingMethods = ['reverse', "'reverse'", '"reverse"', ...helpers_1.sortLike];
exports.rule = {
    meta: {
        messages: {
            moveMethod: 'Move this array "{{method}}" operation to a separate statement.',
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            CallExpression(node) {
                const callee = node.callee;
                if (callee.type === 'MemberExpression') {
                    const propertyText = context.getSourceCode().getText(callee.property);
                    if (isArrayMutatingCall(callee, services, propertyText)) {
                        const mutatedArray = callee.object;
                        if (isIdentifierOrPropertyAccessExpression(mutatedArray, services) &&
                            !isInSelfAssignment(mutatedArray, node) &&
                            isForbiddenOperation(node)) {
                            context.report({
                                messageId: 'moveMethod',
                                data: {
                                    method: formatMethod(propertyText),
                                },
                                node,
                            });
                        }
                    }
                }
            },
        };
    },
};
function formatMethod(mutatingMethod) {
    if (mutatingMethod.startsWith('"') || mutatingMethod.startsWith("'")) {
        return mutatingMethod.substr(1, mutatingMethod.length - 2);
    }
    else {
        return mutatingMethod;
    }
}
function isArrayMutatingCall(memberExpression, services, propertyText) {
    return arrayMutatingMethods.includes(propertyText) && (0, helpers_1.isArray)(memberExpression.object, services);
}
function isIdentifierOrPropertyAccessExpression(node, services) {
    return (node.type === 'Identifier' ||
        (node.type === 'MemberExpression' && !isGetAccessor(node.property, services)));
}
function isGetAccessor(node, services) {
    const symbol = (0, helpers_1.getSymbolAtLocation)(node, services);
    const declarations = symbol && symbol.declarations;
    return (declarations !== undefined &&
        declarations.length === 1 &&
        declarations[0].kind === ts.SyntaxKind.GetAccessor);
}
function isInSelfAssignment(mutatedArray, node) {
    const parent = node.parent;
    return (
    // check assignment
    parent !== undefined &&
        parent.type === 'AssignmentExpression' &&
        parent.operator === '=' &&
        parent.left.type === 'Identifier' &&
        mutatedArray.type === 'Identifier' &&
        parent.left.name === mutatedArray.name);
}
function isForbiddenOperation(node) {
    return !isStandaloneExpression(node) && !isReturnedExpression(node);
}
function isStandaloneExpression(node) {
    const parent = node.parent;
    return (parent === null || parent === void 0 ? void 0 : parent.type) === 'ExpressionStatement';
}
function isReturnedExpression(node) {
    const ancestors = (0, helpers_1.localAncestorsChain)(node);
    const returnIdx = ancestors.findIndex(ancestor => ancestor.type === 'ReturnStatement');
    return (returnIdx > -1 &&
        ancestors
            .slice(0, returnIdx)
            .every(ancestor => ['ArrayExpression', 'ObjectExpression', 'ConditionalExpression', 'SpreadElement'].includes(ancestor.type)));
}
//# sourceMappingURL=no-misleading-array-reverse.js.map