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
// https://sonarsource.github.io/rspec/#/rspec/S4782/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
exports.rule = {
    meta: {
        hasSuggestions: true,
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
    create(context) {
        if (!(0, helpers_1.isRequiredParserServices)(context.parserServices)) {
            return {};
        }
        function checkProperty(node) {
            const tsNode = node;
            const optionalToken = context
                .getSourceCode()
                .getFirstToken(node, token => token.value === '?');
            if (!tsNode.optional || !optionalToken) {
                return;
            }
            const typeNode = getUndefinedTypeAnnotation(tsNode.typeAnnotation);
            if (typeNode) {
                const suggest = getQuickFixSuggestions(context, optionalToken, typeNode);
                const secondaryLocations = [typeNode];
                const message = (0, helpers_1.toEncodedMessage)("Consider removing 'undefined' type or '?' specifier, one of them is redundant.", secondaryLocations);
                context.report({
                    message,
                    loc: optionalToken.loc,
                    suggest,
                });
            }
        }
        return {
            'PropertyDefinition, TSPropertySignature': (node) => checkProperty(node),
        };
    },
};
function getUndefinedTypeAnnotation(tsTypeAnnotation) {
    if (tsTypeAnnotation) {
        return getUndefinedTypeNode(tsTypeAnnotation.typeAnnotation);
    }
    return undefined;
}
function getUndefinedTypeNode(typeNode) {
    if (typeNode.type === 'TSUndefinedKeyword') {
        return typeNode;
    }
    else if (typeNode.type === 'TSUnionType') {
        return typeNode.types.map(getUndefinedTypeNode).find(tpe => tpe !== undefined);
    }
    return undefined;
}
function getQuickFixSuggestions(context, optionalToken, undefinedType) {
    var _a;
    const suggestions = [
        {
            desc: 'Remove "?" operator',
            fix: fixer => fixer.remove(optionalToken),
        },
    ];
    if (((_a = undefinedType.parent) === null || _a === void 0 ? void 0 : _a.type) === 'TSUnionType') {
        suggestions.push(getUndefinedRemovalSuggestion(context, undefinedType));
    }
    return suggestions;
}
function getUndefinedRemovalSuggestion(context, undefinedType) {
    return {
        desc: 'Remove "undefined" type annotation',
        fix: fixer => {
            const fixes = [];
            const unionType = undefinedType.parent;
            if (unionType.types.length === 2) {
                const unionTypeNode = unionType;
                const otherType = unionType.types[0] === undefinedType ? unionType.types[1] : unionType.types[0];
                const otherTypeText = context.getSourceCode().getText(otherType);
                fixes.push(fixer.replaceText(unionTypeNode, otherTypeText));
                const tokenBefore = context.getSourceCode().getTokenBefore(unionTypeNode);
                const tokenAfter = context.getSourceCode().getTokenAfter(unionTypeNode);
                if ((tokenBefore === null || tokenBefore === void 0 ? void 0 : tokenBefore.value) === '(' && (tokenAfter === null || tokenAfter === void 0 ? void 0 : tokenAfter.value) === ')') {
                    fixes.push(fixer.remove(tokenBefore));
                    fixes.push(fixer.remove(tokenAfter));
                }
            }
            else {
                const index = unionType.types.indexOf(undefinedType);
                if (index === 0) {
                    fixes.push(fixer.removeRange([undefinedType.range[0], unionType.types[1].range[0]]));
                }
                else {
                    fixes.push(fixer.removeRange([unionType.types[index - 1].range[1], undefinedType.range[1]]));
                }
            }
            return fixes;
        },
    };
}
//# sourceMappingURL=no-redundant-optional.js.map