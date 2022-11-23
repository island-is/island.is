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
// https://sonarsource.github.io/rspec/#/rspec/S2234/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
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
        const services = context.parserServices;
        const canResolveType = (0, helpers_1.isRequiredParserServices)(services);
        function checkArguments(functionCall) {
            const resolvedFunction = resolveFunctionDeclaration(functionCall);
            if (!resolvedFunction) {
                return;
            }
            const { params: functionParameters, declaration: functionDeclaration } = resolvedFunction;
            const argumentNames = functionCall.arguments.map(arg => {
                const argument = arg;
                return (0, nodes_1.isIdentifier)(argument) ? argument.name : undefined;
            });
            for (let argumentIndex = 0; argumentIndex < argumentNames.length; argumentIndex++) {
                const argumentName = argumentNames[argumentIndex];
                if (argumentName) {
                    const swappedArgumentName = getSwappedArgumentName(argumentNames, functionParameters, argumentName, argumentIndex, functionCall);
                    if (swappedArgumentName && !areComparedArguments([argumentName, swappedArgumentName])) {
                        raiseIssue(argumentName, swappedArgumentName, functionDeclaration, functionCall);
                        return;
                    }
                }
            }
        }
        function areComparedArguments(argumentNames) {
            function getName(node) {
                switch (node.type) {
                    case 'Identifier':
                        return node.name;
                    case 'CallExpression':
                        return getName(node.callee);
                    case 'MemberExpression':
                        return getName(node.object);
                    default:
                        return undefined;
                }
            }
            function checkComparedArguments(lhs, rhs) {
                return ([lhs, rhs].map(getName).filter(name => name && argumentNames.includes(name)).length ===
                    argumentNames.length);
            }
            const maybeIfStmt = context
                .getAncestors()
                .reverse()
                .find(ancestor => ancestor.type === 'IfStatement');
            if (maybeIfStmt) {
                const { test } = maybeIfStmt;
                switch (test.type) {
                    case 'BinaryExpression':
                        const binExpr = test;
                        if (['==', '!=', '===', '!==', '<', '<=', '>', '>='].includes(binExpr.operator)) {
                            const { left: lhs, right: rhs } = binExpr;
                            return checkComparedArguments(lhs, rhs);
                        }
                        break;
                    case 'CallExpression':
                        const callExpr = test;
                        if (callExpr.arguments.length === 1 && callExpr.callee.type === 'MemberExpression') {
                            const [lhs, rhs] = [callExpr.callee.object, callExpr.arguments[0]];
                            return checkComparedArguments(lhs, rhs);
                        }
                        break;
                }
            }
            return false;
        }
        function resolveFunctionDeclaration(node) {
            if (canResolveType) {
                return resolveFromTSSignature(node);
            }
            let functionDeclaration = null;
            if ((0, helpers_1.isFunctionNode)(node.callee)) {
                functionDeclaration = node.callee;
            }
            else if (node.callee.type === 'Identifier') {
                functionDeclaration = (0, helpers_1.resolveFromFunctionReference)(context, node.callee);
            }
            if (!functionDeclaration) {
                return null;
            }
            return {
                params: extractFunctionParameters(functionDeclaration),
                declaration: functionDeclaration,
            };
        }
        function resolveFromTSSignature(node) {
            const signature = (0, helpers_1.getSignatureFromCallee)(node, services);
            if (signature && signature.declaration) {
                return {
                    params: signature.parameters.map(param => param.name),
                    declaration: services.tsNodeToESTreeNodeMap.get(signature.declaration),
                };
            }
            return null;
        }
        function getSwappedArgumentName(argumentNames, functionParameters, argumentName, argumentIndex, node) {
            const indexInFunctionDeclaration = functionParameters.findIndex(functionParameterName => functionParameterName === argumentName);
            if (indexInFunctionDeclaration >= 0 && indexInFunctionDeclaration !== argumentIndex) {
                const potentiallySwappedArgument = argumentNames[indexInFunctionDeclaration];
                if (potentiallySwappedArgument &&
                    potentiallySwappedArgument === functionParameters[argumentIndex] &&
                    haveCompatibleTypes(node.arguments[argumentIndex], node.arguments[indexInFunctionDeclaration])) {
                    return potentiallySwappedArgument;
                }
            }
            return null;
        }
        function haveCompatibleTypes(arg1, arg2) {
            if (canResolveType) {
                const type1 = normalizeType((0, helpers_1.getTypeAsString)(arg1, services));
                const type2 = normalizeType((0, helpers_1.getTypeAsString)(arg2, services));
                return type1 === type2;
            }
            return true;
        }
        function raiseIssue(arg1, arg2, functionDeclaration, node) {
            const primaryMessage = `Arguments '${arg1}' and '${arg2}' have the same names but not the same order as the function parameters.`;
            const encodedMessage = {
                message: primaryMessage,
                secondaryLocations: getSecondaryLocations(functionDeclaration),
            };
            context.report({
                message: JSON.stringify(encodedMessage),
                loc: getParametersClauseLocation(node.arguments),
            });
        }
        return {
            NewExpression: (node) => {
                checkArguments(node);
            },
            CallExpression: (node) => {
                checkArguments(node);
            },
        };
    },
};
function extractFunctionParameters(functionDeclaration) {
    return functionDeclaration.params.map(param => {
        const identifiers = (0, helpers_1.resolveIdentifiers)(param);
        if (identifiers.length === 1 && identifiers[0]) {
            return identifiers[0].name;
        }
        return undefined;
    });
}
function getSecondaryLocations(functionDeclaration) {
    if (functionDeclaration && functionDeclaration.params && functionDeclaration.params.length > 0) {
        const { start, end } = getParametersClauseLocation(functionDeclaration.params);
        return [
            {
                message: 'Formal parameters',
                line: start.line,
                column: start.column,
                endLine: end.line,
                endColumn: end.column,
            },
        ];
    }
    return [];
}
function getParametersClauseLocation(parameters) {
    const firstParam = parameters[0];
    const lastParam = parameters[parameters.length - 1];
    return { start: firstParam.loc.start, end: lastParam.loc.end };
}
function normalizeType(typeAsString) {
    switch (typeAsString) {
        case 'String':
            return 'string';
        case 'Boolean':
            return 'boolean';
        case 'Number':
            return 'number';
        default:
            return typeAsString;
    }
}
//# sourceMappingURL=arguments-order.js.map