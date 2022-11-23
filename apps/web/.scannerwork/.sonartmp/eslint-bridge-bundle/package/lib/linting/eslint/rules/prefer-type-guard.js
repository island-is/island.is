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
// https://sonarsource.github.io/rspec/#/rspec/S4322/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            useTypePredicate: 'Declare this function return type using type predicate "{{castedExpressionText}} is {{castedTypeText}}".',
            suggestTypePredicate: 'Use type predicate',
        },
    },
    create(context) {
        return {
            "MethodDefinition[kind='method'] FunctionExpression": function (node) {
                checkFunctionLikeDeclaration(node, context);
            },
            FunctionDeclaration(node) {
                checkFunctionLikeDeclaration(node, context);
            },
        };
    },
};
function checkFunctionLikeDeclaration(functionDeclaration, context) {
    if (functionDeclaration.returnType &&
        functionDeclaration.returnType.typeAnnotation.type === 'TSTypePredicate') {
        return;
    }
    const body = functionDeclaration.body;
    const returnedExpression = getReturnedExpression(body);
    if (!returnedExpression) {
        return;
    }
    if (isInequalityBinaryExpression(returnedExpression)) {
        const { left, right } = returnedExpression;
        if ((0, helpers_1.isUndefined)(right)) {
            checkCastedType(functionDeclaration, left, context);
        }
        else if ((0, helpers_1.isUndefined)(left)) {
            checkCastedType(functionDeclaration, right, context);
        }
    }
    else if (isBooleanCall(returnedExpression)) {
        checkCastedType(functionDeclaration, returnedExpression.arguments[0], context);
    }
    else if (isNegation(returnedExpression) && isNegation(returnedExpression.argument)) {
        checkCastedType(functionDeclaration, returnedExpression.argument.argument, context);
    }
}
function getReturnedExpression(block) {
    if (block && block.body.length === 1) {
        const statement = block.body[0];
        if (statement.type === 'ReturnStatement') {
            return statement.argument;
        }
    }
    return undefined;
}
function isInequalityBinaryExpression(returnExpression) {
    return (returnExpression.type === 'BinaryExpression' &&
        (returnExpression.operator === '!==' || returnExpression.operator === '!='));
}
function checkCastedType(node, expression, context) {
    const sourceCode = context.getSourceCode();
    const castedType = getCastTupleFromMemberExpression(expression);
    if (castedType && castedType[1].type !== 'TSAnyKeyword') {
        const nOfParam = node.params.length;
        if (nOfParam === 1 || (nOfParam === 0 && castedType[0].type === 'ThisExpression')) {
            const castedExpressionText = sourceCode.getText(castedType[0]);
            const castedTypeText = sourceCode.getText(castedType[1]);
            const predicate = `: ${castedExpressionText} is ${castedTypeText}`;
            const suggest = getTypePredicateSuggestion(node, context, predicate);
            context.report({
                messageId: 'useTypePredicate',
                data: {
                    castedExpressionText,
                    castedTypeText,
                },
                loc: (0, locations_1.getMainFunctionTokenLocation)(node, (0, helpers_1.getParent)(context), context),
                suggest,
            });
        }
    }
}
function getTypePredicateSuggestion(node, context, predicate) {
    const suggestions = [];
    let fix;
    if (node.returnType) {
        fix = fixer => fixer.replaceText(node.returnType, predicate);
    }
    else {
        const closingParenthesis = context
            .getSourceCode()
            .getTokenBefore(node.body, token => token.value === ')');
        fix = fixer => fixer.insertTextAfter(closingParenthesis, predicate);
    }
    suggestions.push({ messageId: 'suggestTypePredicate', fix });
    return suggestions;
}
function getCastTupleFromMemberExpression(node) {
    if (node.type === 'MemberExpression') {
        const object = node.object;
        if (object.type === 'TSAsExpression' || object.type === 'TSTypeAssertion') {
            return [object.expression, object.typeAnnotation];
        }
    }
    return undefined;
}
function isNegation(node) {
    return node.type === 'UnaryExpression' && node.prefix && node.operator === '!';
}
function isBooleanCall(node) {
    if (node.type === 'CallExpression') {
        const callee = node.callee;
        return node.arguments.length === 1 && callee.type === 'Identifier' && callee.name === 'Boolean';
    }
    return false;
}
//# sourceMappingURL=prefer-type-guard.js.map