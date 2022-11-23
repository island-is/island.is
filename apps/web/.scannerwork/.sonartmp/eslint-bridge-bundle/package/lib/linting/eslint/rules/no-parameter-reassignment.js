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
// https://sonarsource.github.io/rspec/#/rspec/S1226/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            noReassignment: 'Introduce a new variable or use its initial value before reassigning "{{reference}}".',
        },
    },
    create(context) {
        let variableUsageContext = {
            type: 'global',
            variablesToCheckInCurrentScope: new Set(),
            variablesToCheck: new Set(),
            variablesRead: new Set(),
            referencesByIdentifier: new Map(),
        };
        function checkIdentifierUsage(identifier, identifierContextType) {
            if (variableUsageContext.type !== identifierContextType) {
                return;
            }
            const variableName = identifier.name;
            const currentReference = getReference(variableUsageContext, identifier);
            if (currentReference &&
                !currentReference.init &&
                !variableUsageContext.variablesRead.has(variableName)) {
                if (variableUsageContext.variablesToCheck.has(variableName) &&
                    currentReference.isWriteOnly() &&
                    !isUsedInWriteExpression(variableName, currentReference.writeExpr)) {
                    // we do not raise issue when value is reassigned inside a top-level IfStatement, as it might be a shift or
                    // default value reassignment
                    if (isInsideTopLevelIfStatement(context) ||
                        context.getAncestors().some(node => node.type === 'SwitchCase') // issue-2398
                    ) {
                        return;
                    }
                    raiseIssue(currentReference);
                }
                markAsRead(variableUsageContext, variableName);
            }
            else if (variableName === 'arguments') {
                markAllFunctionArgumentsAsRead(variableUsageContext);
            }
        }
        function isUsedInWriteExpression(variableName, writeExpr) {
            return (writeExpr &&
                context
                    .getSourceCode()
                    .getFirstToken(writeExpr, token => token.value === variableName || token.value === 'arguments'));
        }
        function raiseIssue(reference) {
            const locationHolder = getPreciseLocationHolder(reference);
            context.report({
                messageId: 'noReassignment',
                data: {
                    reference: reference.identifier.name,
                },
                ...locationHolder,
            });
        }
        function popContext() {
            variableUsageContext = variableUsageContext.parentContext
                ? variableUsageContext.parentContext
                : variableUsageContext;
        }
        return {
            onCodePathStart(_codePath, node) {
                const currentScope = context.getScope();
                if (currentScope && currentScope.type === 'function') {
                    const { referencesByIdentifier, variablesToCheck, variablesToCheckInCurrentScope } = computeNewContextInfo(variableUsageContext, context, node);
                    const functionName = getFunctionName(node);
                    if (functionName) {
                        variablesToCheck.delete(functionName);
                    }
                    variableUsageContext = {
                        type: 'function',
                        parentContext: variableUsageContext,
                        variablesToCheck,
                        referencesByIdentifier,
                        variablesToCheckInCurrentScope,
                        variablesRead: computeSetDifference(variableUsageContext.variablesRead, variablesToCheckInCurrentScope),
                    };
                }
                else {
                    variableUsageContext = {
                        type: 'global',
                        parentContext: variableUsageContext,
                        variablesToCheckInCurrentScope: new Set(),
                        variablesToCheck: new Set(),
                        variablesRead: new Set(),
                        referencesByIdentifier: new Map(),
                    };
                }
            },
            onCodePathSegmentLoop(_fromSegment, _toSegment, node) {
                const parent = (0, helpers_1.getParent)(context);
                if (!isForEachLoopStart(node, parent)) {
                    return;
                }
                const currentScope = context.getSourceCode().scopeManager.acquire(parent.body);
                const { referencesByIdentifier, variablesToCheck, variablesToCheckInCurrentScope } = computeNewContextInfo(variableUsageContext, context, parent.left);
                if (currentScope) {
                    for (const ref of currentScope.references) {
                        referencesByIdentifier.set(ref.identifier, ref);
                    }
                }
                // In case of array or object pattern expression, the left hand side are not declared variables but simply identifiers
                (0, helpers_1.resolveIdentifiers)(parent.left, true)
                    .map(identifier => identifier.name)
                    .forEach(name => {
                    variablesToCheck.add(name);
                    variablesToCheckInCurrentScope.add(name);
                });
                variableUsageContext = {
                    type: 'foreach',
                    parentContext: variableUsageContext,
                    variablesToCheckInCurrentScope,
                    variablesToCheck,
                    variablesRead: computeSetDifference(variableUsageContext.variablesRead, variablesToCheckInCurrentScope),
                    referencesByIdentifier,
                };
            },
            onCodePathSegmentStart(_segment, node) {
                if (node.type !== 'CatchClause') {
                    return;
                }
                const { referencesByIdentifier, variablesToCheck, variablesToCheckInCurrentScope } = computeNewContextInfo(variableUsageContext, context, node);
                variableUsageContext = {
                    type: 'catch',
                    parentContext: variableUsageContext,
                    variablesToCheckInCurrentScope,
                    variablesToCheck,
                    variablesRead: computeSetDifference(variableUsageContext.variablesRead, variablesToCheckInCurrentScope),
                    referencesByIdentifier,
                };
            },
            onCodePathEnd: popContext,
            'ForInStatement:exit': popContext,
            'ForOfStatement:exit': popContext,
            'CatchClause:exit': popContext,
            '*:function > BlockStatement Identifier': (node) => checkIdentifierUsage(node, 'function'),
            'ForInStatement > *:statement Identifier': (node) => checkIdentifierUsage(node, 'foreach'),
            'ForOfStatement > *:statement Identifier': (node) => checkIdentifierUsage(node, 'foreach'),
            'CatchClause > BlockStatement Identifier': (node) => checkIdentifierUsage(node, 'catch'),
        };
    },
};
function isInsideTopLevelIfStatement(context) {
    const ifStatementParent = context.getAncestors().find(node => node.type === 'IfStatement');
    if (ifStatementParent) {
        return (hasParentOfType(ifStatementParent.parent, ['BlockStatement']) &&
            hasParentOfType(ifStatementParent.parent.parent, helpers_1.FUNCTION_NODES));
    }
    return false;
}
function hasParentOfType(parent, expectedType) {
    return !!parent && expectedType.includes(parent.type);
}
/**
 * Computes the set difference (a \ b)
 */
function computeSetDifference(a, b) {
    return new Set([...a].filter(str => !b.has(str)));
}
function getFunctionName(node) {
    return !node.id ? null : node.id.name;
}
function isForEachLoopStart(node, parent) {
    return (node.type === 'BlockStatement' &&
        !!parent &&
        (parent.type === 'ForInStatement' || parent.type === 'ForOfStatement'));
}
function computeNewContextInfo(variableUsageContext, context, node) {
    const referencesByIdentifier = new Map();
    const variablesToCheck = new Set(variableUsageContext.variablesToCheck);
    const variablesToCheckInCurrentScope = new Set();
    context.getDeclaredVariables(node).forEach(variable => {
        variablesToCheck.add(variable.name);
        variablesToCheckInCurrentScope.add(variable.name);
        for (const currentRef of variable.references) {
            referencesByIdentifier.set(currentRef.identifier, currentRef);
        }
    });
    return { referencesByIdentifier, variablesToCheck, variablesToCheckInCurrentScope };
}
function markAsRead(context, variableName) {
    context.variablesRead.add(variableName);
    if (!context.variablesToCheckInCurrentScope.has(variableName) && context.parentContext) {
        markAsRead(context.parentContext, variableName);
    }
}
function markAllFunctionArgumentsAsRead(variableUsageContext) {
    let functionContext = variableUsageContext;
    while (functionContext && functionContext.type !== 'function') {
        functionContext = functionContext.parentContext;
    }
    if (functionContext) {
        for (const variableName of functionContext.variablesToCheckInCurrentScope) {
            functionContext.variablesRead.add(variableName);
        }
    }
}
function getPreciseLocationHolder(reference) {
    const identifierLoc = reference.identifier.loc;
    if (identifierLoc && reference.writeExpr && reference.writeExpr.loc) {
        return { loc: { start: identifierLoc.start, end: reference.writeExpr.loc.end } };
    }
    return { node: reference.identifier };
}
function getReference(variableUsageContext, identifier) {
    const identifierReference = variableUsageContext.referencesByIdentifier.get(identifier);
    if (!identifierReference && variableUsageContext.parentContext) {
        return getReference(variableUsageContext.parentContext, identifier);
    }
    return identifierReference;
}
//# sourceMappingURL=no-parameter-reassignment.js.map