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
// https://sonarsource.github.io/rspec/#/rspec/S1854/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const nodes_1 = require("eslint-plugin-sonarjs/lib/utils/nodes");
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            removeAssignment: 'Remove this useless assignment to variable "{{variable}}".',
        },
    },
    create(context) {
        const codePathStack = [];
        const liveVariablesMap = new Map();
        const readVariables = new Set();
        // map from Variable to CodePath ids where variable is used
        const variableUsages = new Map();
        const referencesUsedInDestructuring = new Set();
        const destructuringStack = [];
        return {
            ':matches(AssignmentExpression, VariableDeclarator[init])': (node) => {
                pushAssignmentContext(node);
            },
            ':matches(AssignmentExpression, VariableDeclarator[init]):exit': () => {
                popAssignmentContext();
            },
            Identifier: (node) => {
                if (isEnumConstant()) {
                    return;
                }
                checkIdentifierUsage(node);
            },
            JSXIdentifier: (node) => {
                checkIdentifierUsage(node);
            },
            ObjectPattern: () => {
                destructuringStack.push(new DestructuringContext());
            },
            'ObjectPattern > Property > Identifier': (node) => {
                const destructuring = peek(destructuringStack);
                const { ref } = resolveReference(node);
                if (ref) {
                    destructuring.references.push(ref);
                }
            },
            'ObjectPattern > :matches(RestElement, ExperimentalRestProperty)': () => {
                peek(destructuringStack).hasRest = true;
            },
            'ObjectPattern:exit': () => {
                const destructuring = destructuringStack.pop();
                if (destructuring && destructuring.hasRest) {
                    destructuring.references.forEach(ref => referencesUsedInDestructuring.add(ref));
                }
            },
            'Program:exit': () => {
                (0, helpers_1.lva)(liveVariablesMap);
                liveVariablesMap.forEach(lva => {
                    checkSegment(lva);
                    reportNeverReadVariables(lva);
                });
            },
            // CodePath events
            onCodePathSegmentStart: (segment) => {
                liveVariablesMap.set(segment.id, new helpers_1.LiveVariables(segment));
            },
            onCodePathStart: codePath => {
                pushContext(new CodePathContext(codePath));
            },
            onCodePathEnd: () => {
                popContext();
            },
        };
        function pushAssignmentContext(node) {
            peek(codePathStack).assignmentStack.push(new AssignmentContext(node));
        }
        function popAssignmentContext() {
            const assignment = peek(codePathStack).assignmentStack.pop();
            assignment.rhs.forEach(r => processReference(r));
            assignment.lhs.forEach(r => processReference(r));
        }
        function checkSegment(liveVariables) {
            const willBeRead = new Set(liveVariables.out);
            const references = [...liveVariables.references].reverse();
            references.forEach(ref => {
                const variable = ref.resolved;
                if (!variable) {
                    return;
                }
                if (ref.isWrite()) {
                    if (!willBeRead.has(variable) && shouldReport(ref)) {
                        report(ref);
                    }
                    willBeRead.delete(variable);
                }
                if (ref.isRead()) {
                    willBeRead.add(variable);
                }
            });
        }
        function reportNeverReadVariables(lva) {
            lva.references.forEach(ref => {
                if (shouldReportReference(ref) && !readVariables.has(ref.resolved)) {
                    report(ref);
                }
            });
        }
        function shouldReport(ref) {
            const variable = ref.resolved;
            return (variable &&
                shouldReportReference(ref) &&
                !variableUsedOutsideOfCodePath(variable) &&
                readVariables.has(variable));
        }
        function shouldReportReference(ref) {
            const variable = ref.resolved;
            return (variable &&
                isLocalVar(variable) &&
                !isReferenceWithBasicValue(ref) &&
                !isDefaultParameter(ref) &&
                !referencesUsedInDestructuring.has(ref) &&
                !variable.name.startsWith('_') &&
                !isIncrementOrDecrement(ref) &&
                !isNullAssignment(ref));
        }
        function isIncrementOrDecrement(ref) {
            const parent = ref.identifier.parent;
            return parent && parent.type === 'UpdateExpression';
        }
        function isNullAssignment(ref) {
            const parent = ref.identifier.parent;
            return (parent &&
                parent.type === 'AssignmentExpression' &&
                (0, helpers_1.isNullLiteral)(parent.right));
        }
        function isEnumConstant() {
            return context.getAncestors().some(n => n.type === 'TSEnumDeclaration');
        }
        function isDefaultParameter(ref) {
            if (ref.identifier.type !== 'Identifier') {
                return false;
            }
            const parent = ref.identifier.parent;
            return parent && parent.type === 'AssignmentPattern';
        }
        function isLocalVar(variable) {
            // @ts-ignore
            const scope = variable.scope;
            const node = scope.block;
            return node.type !== 'Program' && node.type !== 'TSModuleDeclaration';
        }
        function variableUsedOutsideOfCodePath(variable) {
            return variableUsages.get(variable).size > 1;
        }
        function isReferenceWithBasicValue(ref) {
            return ref.init && ref.writeExpr && isBasicValue(ref.writeExpr);
        }
        function isBasicValue(node) {
            const node1 = node;
            if ((0, nodes_1.isLiteral)(node1)) {
                return node1.value === '' || [0, 1, null, true, false].includes(node1.value);
            }
            if ((0, nodes_1.isIdentifier)(node1)) {
                return node1.name === 'undefined';
            }
            if ((0, helpers_1.isUnaryExpression)(node)) {
                return isBasicValue(node.argument);
            }
            if ((0, nodes_1.isObjectExpression)(node1)) {
                return node1.properties.length === 0;
            }
            if ((0, helpers_1.isArrayExpression)(node)) {
                return node.elements.length === 0;
            }
            return false;
        }
        function report(ref) {
            context.report({
                messageId: 'removeAssignment',
                data: {
                    variable: ref.identifier.name,
                },
                loc: ref.identifier.loc,
            });
        }
        function checkIdentifierUsage(node) {
            const { ref, variable } = node.type === 'Identifier' ? resolveReference(node) : resolveJSXReference(node);
            if (ref) {
                processReference(ref);
                if (variable) {
                    updateReadVariables(ref);
                }
            }
            if (variable) {
                updateVariableUsages(variable);
            }
        }
        function resolveJSXReference(node) {
            if (isJSXAttributeName(node)) {
                return {};
            }
            const jsxReference = new JSXReference(node, context.getScope());
            return { ref: jsxReference, variable: jsxReference.resolved };
        }
        function isJSXAttributeName(node) {
            const parent = node.parent;
            return parent && parent.type === 'JSXAttribute' && parent.name === node;
        }
        function processReference(ref) {
            const assignmentStack = peek(codePathStack).assignmentStack;
            if (assignmentStack.length > 0) {
                const assignment = peek(assignmentStack);
                assignment.add(ref);
            }
            else {
                peek(codePathStack).codePath.currentSegments.forEach(segment => {
                    lvaForSegment(segment).add(ref);
                });
            }
        }
        function lvaForSegment(segment) {
            let lva;
            if (liveVariablesMap.has(segment.id)) {
                lva = liveVariablesMap.get(segment.id);
            }
            else {
                lva = new helpers_1.LiveVariables(segment);
                liveVariablesMap.set(segment.id, lva);
            }
            return lva;
        }
        function updateReadVariables(reference) {
            const variable = reference.resolved;
            if (reference.isRead()) {
                readVariables.add(variable);
            }
        }
        function updateVariableUsages(variable) {
            const codePathId = peek(codePathStack).codePath.id;
            if (variableUsages.has(variable)) {
                variableUsages.get(variable).add(codePathId);
            }
            else {
                variableUsages.set(variable, new Set([codePathId]));
            }
        }
        function popContext() {
            codePathStack.pop();
        }
        function pushContext(codePathContext) {
            codePathStack.push(codePathContext);
        }
        function resolveReference(node) {
            return resolveReferenceRecursively(node, context.getScope());
        }
        function resolveReferenceRecursively(node, scope) {
            if (scope === null) {
                return { ref: null, variable: null };
            }
            const ref = scope.references.find(r => r.identifier === node);
            if (ref) {
                return { ref, variable: ref.resolved };
            }
            else {
                // if it's not a reference, it can be just declaration without initializer
                const variable = scope.variables.find(v => v.defs.find(def => def.name === node));
                if (variable) {
                    return { ref: null, variable };
                }
                // in theory we only need 1-level recursion, only for switch expression, which is likely a bug in eslint
                // generic recursion is used for safety & readability
                return resolveReferenceRecursively(node, scope.upper);
            }
        }
    },
};
class CodePathContext {
    constructor(codePath) {
        this.liveVariablesMap = new Map();
        this.liveVariablesStack = [];
        this.segments = new Map();
        this.assignmentStack = [];
        this.codePath = codePath;
    }
}
class DestructuringContext {
    constructor() {
        this.hasRest = false;
        this.references = [];
    }
}
class AssignmentContext {
    constructor(node) {
        this.lhs = new Set();
        this.rhs = new Set();
        this.node = node;
    }
    isRhs(node) {
        return (0, nodes_1.isAssignmentExpression)(this.node) ? this.node.right === node : this.node.init === node;
    }
    isLhs(node) {
        return (0, nodes_1.isAssignmentExpression)(this.node) ? this.node.left === node : this.node.id === node;
    }
    add(ref) {
        let parent = ref.identifier;
        while (parent) {
            if (this.isLhs(parent)) {
                this.lhs.add(ref);
                break;
            }
            if (this.isRhs(parent)) {
                this.rhs.add(ref);
                break;
            }
            parent = parent.parent;
        }
        if (parent === null) {
            throw new Error('failed to find assignment lhs/rhs');
        }
    }
}
class JSXReference {
    constructor(node, scope) {
        this.init = false;
        this.writeExpr = null;
        this.from = scope;
        this.identifier = node;
        this.resolved = findJSXVariableInScope(node, scope);
    }
    isRead() {
        return true;
    }
    isReadOnly() {
        return true;
    }
    isReadWrite() {
        return false;
    }
    isWrite() {
        return false;
    }
    isWriteOnly() {
        return false;
    }
}
function findJSXVariableInScope(node, scope) {
    return (scope &&
        (scope.variables.find(v => v.name === node.name) || findJSXVariableInScope(node, scope.upper)));
}
function peek(arr) {
    return arr[arr.length - 1];
}
//# sourceMappingURL=no-dead-store.js.map