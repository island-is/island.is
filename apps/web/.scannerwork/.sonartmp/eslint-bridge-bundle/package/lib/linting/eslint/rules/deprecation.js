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
// https://sonarsource.github.io/rspec/#/rspec/S1874/javascript
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
            deprecation: "'{{symbol}}' is deprecated. {{reason}}",
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            Identifier: (node) => {
                const parent = (0, helpers_1.getParent)(context);
                if (isShortHandProperty(parent) && parent.key === node) {
                    // to not report twice
                    return;
                }
                if (isObjectExpressionProperty(node, context)) {
                    return;
                }
                const id = node;
                const insideImportExport = context.getAncestors().some(anc => anc.type.includes('Import'));
                if (insideImportExport || isDeclaration(id, context)) {
                    return;
                }
                const deprecation = getDeprecation(id, services, context);
                if (deprecation) {
                    context.report({
                        node,
                        messageId: 'deprecation',
                        data: {
                            symbol: id.name,
                            reason: deprecation.reason,
                        },
                    });
                }
            },
        };
    },
};
function isDeclaration(id, context) {
    const parent = (0, helpers_1.getParent)(context);
    if (isShortHandProperty(parent) && parent.value === id) {
        return false;
    }
    const variable = context.getScope().variables.find(v => v.name === id.name);
    if (variable) {
        return variable.defs.some(def => def.name === id);
    }
    const declarationTypes = [
        'PropertyDefinition',
        'TSPropertySignature',
        'TSDeclareFunction',
        'FunctionDeclaration',
        'MethodDefinition',
        'TSMethodSignature',
    ];
    return parent && declarationTypes.includes(parent.type);
}
function getDeprecation(id, services, context) {
    const tc = services.program.getTypeChecker();
    const callExpression = getCallExpression(context, id);
    if (callExpression) {
        const tsCallExpression = services.esTreeNodeToTSNodeMap.get(callExpression);
        const signature = tc.getResolvedSignature(tsCallExpression);
        if (signature) {
            const deprecation = getJsDocDeprecation(signature.getJsDocTags());
            if (deprecation) {
                return deprecation;
            }
        }
    }
    const symbol = getSymbol(id, services, context, tc);
    if (!symbol) {
        return undefined;
    }
    if (callExpression && isFunction(symbol)) {
        return undefined;
    }
    return getJsDocDeprecation(symbol.getJsDocTags());
}
function getSymbol(id, services, context, tc) {
    let symbol;
    const tsId = services.esTreeNodeToTSNodeMap.get(id);
    const parent = services.esTreeNodeToTSNodeMap.get((0, helpers_1.getParent)(context));
    if (parent.kind === ts.SyntaxKind.BindingElement) {
        symbol = tc.getTypeAtLocation(parent.parent).getProperty(tsId.text);
    }
    else if ((isPropertyAssignment(parent) && parent.name === tsId) ||
        (isShorthandPropertyAssignment(parent) && parent.name === tsId)) {
        try {
            symbol = tc.getPropertySymbolOfDestructuringAssignment(tsId);
        }
        catch (e) {
            // do nothing, we are in object literal, not destructuring
            // no obvious easy way to check that in advance
        }
    }
    else {
        symbol = tc.getSymbolAtLocation(tsId);
    }
    if (symbol && (symbol.flags & ts.SymbolFlags.Alias) !== 0) {
        return tc.getAliasedSymbol(symbol);
    }
    return symbol;
}
function getCallExpression(context, id) {
    const ancestors = context.getAncestors();
    let callee = id;
    let parent = ancestors.length > 0 ? ancestors[ancestors.length - 1] : undefined;
    if (parent && parent.type === 'MemberExpression' && parent.property === id) {
        callee = parent;
        parent = ancestors.length > 1 ? ancestors[ancestors.length - 2] : undefined;
    }
    if (isCallExpression(parent, callee)) {
        return parent;
    }
}
function isCallExpression(node, callee) {
    if (node) {
        if (node.type === 'NewExpression' || node.type === 'CallExpression') {
            return node.callee === callee;
        }
        else if (node.type === 'TaggedTemplateExpression') {
            return node.tag === callee;
        }
    }
    return false;
}
function getJsDocDeprecation(tags) {
    for (const tag of tags) {
        if (tag.name === 'deprecated') {
            return tag.text ? { reason: tag.text.map(e => e.text).join(' ') } : new Deprecation();
        }
    }
    return undefined;
}
function isFunction(symbol) {
    const { declarations } = symbol;
    if (declarations === undefined || declarations.length === 0) {
        return false;
    }
    switch (declarations[0].kind) {
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.FunctionDeclaration:
        case ts.SyntaxKind.FunctionExpression:
        case ts.SyntaxKind.MethodSignature:
            return true;
        default:
            return false;
    }
}
function isPropertyAssignment(node) {
    return node.kind === ts.SyntaxKind.PropertyAssignment;
}
function isShorthandPropertyAssignment(node) {
    return node.kind === ts.SyntaxKind.ShorthandPropertyAssignment;
}
function isShortHandProperty(parent) {
    return !!parent && parent.type === 'Property' && parent.shorthand;
}
function isObjectExpressionProperty(node, context) {
    const ancestors = context.getAncestors();
    const parent = ancestors.pop();
    const grandparent = ancestors.pop();
    return ((parent === null || parent === void 0 ? void 0 : parent.type) === 'Property' &&
        !parent.computed &&
        !parent.shorthand &&
        parent.key === node &&
        (grandparent === null || grandparent === void 0 ? void 0 : grandparent.type) === 'ObjectExpression');
}
class Deprecation {
    constructor() {
        this.reason = '';
    }
}
//# sourceMappingURL=deprecation.js.map