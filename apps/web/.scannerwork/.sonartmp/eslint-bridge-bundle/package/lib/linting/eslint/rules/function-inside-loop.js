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
// https://sonarsource.github.io/rspec/#/rspec/S1515/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
const message = 'Make sure this function is not called after the loop completes.';
const loopLike = 'WhileStatement,DoWhileStatement,ForStatement,ForOfStatement,ForInStatement';
const functionLike = 'FunctionDeclaration,FunctionExpression,ArrowFunctionExpression';
const allowedCallbacks = [
    'replace',
    'forEach',
    'filter',
    'map',
    'find',
    'findIndex',
    'every',
    'some',
    'reduce',
    'reduceRight',
    'sort',
    'each',
];
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
        function getLocalEnclosingLoop(node) {
            return (0, helpers_1.findFirstMatchingAncestor)(node, n => loopLike.includes(n.type));
        }
        return {
            [functionLike]: (node) => {
                const loopNode = getLocalEnclosingLoop(node);
                if (loopNode) {
                    if (!isIIEF(node, context) &&
                        !isAllowedCallbacks(context) &&
                        context.getScope().through.some(ref => !isSafe(ref, loopNode))) {
                        context.report({
                            message: (0, helpers_1.toEncodedMessage)(message, [getMainLoopToken(loopNode, context)]),
                            loc: (0, locations_1.getMainFunctionTokenLocation)(node, (0, helpers_1.getParent)(context), context),
                        });
                    }
                }
            },
        };
    },
};
function isIIEF(node, context) {
    const parent = (0, helpers_1.getParent)(context);
    return (parent &&
        ((parent.type === 'CallExpression' && parent.callee === node) ||
            (parent.type === 'MemberExpression' && parent.object === node)));
}
function isAllowedCallbacks(context) {
    const parent = (0, helpers_1.getParent)(context);
    if (parent && parent.type === 'CallExpression') {
        const callee = parent.callee;
        if (callee.type === 'MemberExpression') {
            return (callee.property.type === 'Identifier' && allowedCallbacks.includes(callee.property.name));
        }
    }
    return false;
}
function isSafe(ref, loopNode) {
    const variable = ref.resolved;
    if (variable) {
        const definition = variable.defs[0];
        const declaration = definition && definition.parent;
        const kind = declaration && declaration.type === 'VariableDeclaration' ? declaration.kind : '';
        if (kind !== 'let' && kind !== 'const') {
            return hasConstValue(variable, loopNode);
        }
    }
    return true;
}
function hasConstValue(variable, loopNode) {
    for (const ref of variable.references) {
        if (ref.isWrite()) {
            //Check if write is in the scope of the loop
            if (ref.from.type === 'block' && ref.from.block === loopNode.body) {
                return false;
            }
            const refRange = ref.identifier.range;
            const range = getLoopTestRange(loopNode);
            //Check if value change in the header of the loop
            if (refRange && range && refRange[0] >= range[0] && refRange[1] <= range[1]) {
                return false;
            }
        }
    }
    return true;
}
function getLoopTestRange(loopNode) {
    const bodyRange = loopNode.body.range;
    if (bodyRange) {
        switch (loopNode.type) {
            case 'ForStatement':
                if (loopNode.test && loopNode.test.range) {
                    return [loopNode.test.range[0], bodyRange[0]];
                }
                break;
            case 'WhileStatement':
            case 'DoWhileStatement':
                return loopNode.test.range;
            case 'ForOfStatement':
            case 'ForInStatement':
                const leftRange = loopNode.range;
                if (leftRange) {
                    return [leftRange[0], bodyRange[0]];
                }
        }
    }
}
function getMainLoopToken(loop, context) {
    const sourceCode = context.getSourceCode();
    let token;
    switch (loop.type) {
        case 'WhileStatement':
        case 'DoWhileStatement':
            token = sourceCode.getTokenBefore(loop.test, t => t.type === 'Keyword' && t.value === 'while');
            break;
        case 'ForStatement':
        case 'ForOfStatement':
        default:
            token = sourceCode.getFirstToken(loop, t => t.type === 'Keyword' && t.value === 'for');
    }
    return token;
}
//# sourceMappingURL=function-inside-loop.js.map