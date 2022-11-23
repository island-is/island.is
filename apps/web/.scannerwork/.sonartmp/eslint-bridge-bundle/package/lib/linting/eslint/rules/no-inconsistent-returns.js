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
// https://sonarsource.github.io/rspec/#/rspec/S3801/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
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
        const sourceCode = context.getSourceCode();
        const functionContextStack = [];
        const checkOnFunctionExit = (node) => checkFunctionLikeDeclaration(node, functionContextStack[functionContextStack.length - 1]);
        function checkFunctionLikeDeclaration(node, functionContext) {
            if (!functionContext ||
                (!!node.returnType &&
                    declaredReturnTypeContainsVoidOrNeverTypes(node.returnType.typeAnnotation))) {
                return;
            }
            checkFunctionForImplicitReturn(functionContext);
            if (hasInconsistentReturns(functionContext)) {
                const [secondaryLocationsHolder, secondaryLocationMessages] = getSecondaryLocations(functionContext, node);
                const message = (0, helpers_1.toEncodedMessage)(`Refactor this function to use "return" consistently.`, secondaryLocationsHolder, secondaryLocationMessages);
                context.report({
                    message,
                    loc: (0, locations_1.getMainFunctionTokenLocation)(node, (0, helpers_1.getParent)(context), context),
                });
            }
        }
        function checkFunctionForImplicitReturn(functionContext) {
            // As this method is called at the exit point of a function definition, the current
            // segments are the ones leading to the exit point at the end of the function. If they
            // are reachable, it means there is an implicit return.
            functionContext.containsImplicitReturn = functionContext.codePath.currentSegments.some(segment => segment.reachable);
        }
        function getSecondaryLocations(functionContext, node) {
            const secondaryLocationsHolder = functionContext.returnStatements.slice();
            const secondaryLocationMessages = functionContext.returnStatements.map(returnStatement => returnStatement.argument ? 'Return with value' : 'Return without value');
            if (functionContext.containsImplicitReturn) {
                const closeCurlyBraceToken = sourceCode.getLastToken(node, token => token.value === '}');
                if (!!closeCurlyBraceToken) {
                    secondaryLocationsHolder.push(closeCurlyBraceToken);
                    secondaryLocationMessages.push('Implicit return without value');
                }
            }
            return [secondaryLocationsHolder, secondaryLocationMessages];
        }
        return {
            onCodePathStart(codePath) {
                functionContextStack.push({
                    codePath,
                    containsReturnWithValue: false,
                    containsReturnWithoutValue: false,
                    containsImplicitReturn: false,
                    returnStatements: [],
                });
            },
            onCodePathEnd() {
                functionContextStack.pop();
            },
            ReturnStatement(node) {
                const currentContext = functionContextStack[functionContextStack.length - 1];
                if (!!currentContext) {
                    const returnStatement = node;
                    currentContext.containsReturnWithValue =
                        currentContext.containsReturnWithValue || !!returnStatement.argument;
                    currentContext.containsReturnWithoutValue =
                        currentContext.containsReturnWithoutValue || !returnStatement.argument;
                    currentContext.returnStatements.push(returnStatement);
                }
            },
            'FunctionDeclaration:exit': checkOnFunctionExit,
            'FunctionExpression:exit': checkOnFunctionExit,
            'ArrowFunctionExpression:exit': checkOnFunctionExit,
        };
    },
};
function hasInconsistentReturns(functionContext) {
    return (functionContext.containsReturnWithValue &&
        (functionContext.containsReturnWithoutValue || functionContext.containsImplicitReturn));
}
function declaredReturnTypeContainsVoidOrNeverTypes(returnTypeNode) {
    return (isVoidType(returnTypeNode) ||
        (returnTypeNode.type === 'TSUnionType' &&
            returnTypeNode.types.some(declaredReturnTypeContainsVoidOrNeverTypes)));
}
function isVoidType(typeNode) {
    return (typeNode.type === 'TSUndefinedKeyword' ||
        typeNode.type === 'TSVoidKeyword' ||
        typeNode.type === 'TSNeverKeyword');
}
//# sourceMappingURL=no-inconsistent-returns.js.map