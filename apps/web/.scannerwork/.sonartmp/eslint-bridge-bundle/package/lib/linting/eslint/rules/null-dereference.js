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
// https://sonarsource.github.io/rspec/#/rspec/S22259/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const equivalence_1 = require("eslint-plugin-sonarjs/lib/utils/equivalence");
var Null;
(function (Null) {
    Null[Null["confirmed"] = 0] = "confirmed";
    Null[Null["discarded"] = 1] = "discarded";
    Null[Null["unknown"] = 2] = "unknown";
})(Null || (Null = {}));
function isNull(n) {
    return (0, helpers_1.isNullLiteral)(n) || (0, helpers_1.isUndefined)(n);
}
const equalOperators = ['==', '==='];
const notEqualOperators = ['!=', '!=='];
exports.rule = {
    meta: {
        messages: {
            nullDereference: 'TypeError can be thrown as "{{symbol}}" might be null or undefined here.',
            shortCircuitError: 'TypeError can be thrown as expression might be null or undefined here.',
        },
    },
    create(context) {
        if (!(0, helpers_1.isRequiredParserServices)(context.parserServices)) {
            return {};
        }
        const alreadyRaisedSymbols = new Set();
        return {
            MemberExpression(node) {
                const { object, optional } = node;
                if (!optional) {
                    checkNullDereference(object, context, alreadyRaisedSymbols);
                }
            },
            'LogicalExpression MemberExpression'(node) {
                const { object, optional } = node;
                if (!optional) {
                    const ancestors = context.getAncestors();
                    const enclosingLogicalExpression = ancestors.find(n => n.type === 'LogicalExpression');
                    checkLogicalNullDereference(enclosingLogicalExpression, object, context);
                }
            },
            ForOfStatement(node) {
                const { right } = node;
                checkNullDereference(right, context, alreadyRaisedSymbols);
            },
            'Program:exit'() {
                alreadyRaisedSymbols.clear();
            },
        };
    },
};
function getNullState(expr, node, context) {
    const { left, right } = expr;
    if ((isNull(right) &&
        (0, equivalence_1.areEquivalent)(left, node, context.getSourceCode())) ||
        (isNull(left) &&
            (0, equivalence_1.areEquivalent)(right, node, context.getSourceCode()))) {
        if (notEqualOperators.includes(expr.operator))
            return Null.discarded;
        if (equalOperators.includes(expr.operator))
            return Null.confirmed;
    }
    return Null.unknown;
}
function checkLogicalNullDereference(expr, node, context) {
    if (expr.left.type === 'BinaryExpression') {
        const nullState = getNullState(expr.left, node, context);
        if ((nullState === Null.confirmed && expr.operator === '&&') ||
            (nullState === Null.discarded && expr.operator === '||')) {
            context.report({
                messageId: 'shortCircuitError',
                node: node,
            });
        }
    }
}
function isWrittenInInnerFunction(symbol, fn) {
    return symbol.references.some(ref => {
        if (ref.isWrite() && ref.identifier.hasOwnProperty('parent')) {
            const enclosingFn = (0, helpers_1.findFirstMatchingAncestor)(ref.identifier, node => helpers_1.functionLike.has(node.type));
            return enclosingFn && enclosingFn !== fn;
        }
        return false;
    });
}
function checkNullDereference(node, context, alreadyRaisedSymbols) {
    var _a;
    if (node.type !== 'Identifier') {
        return;
    }
    const scope = context.getScope();
    const symbol = (_a = scope.references.find(v => v.identifier === node)) === null || _a === void 0 ? void 0 : _a.resolved;
    if (!symbol) {
        return;
    }
    const enclosingFunction = context.getAncestors().find(n => helpers_1.functionLike.has(n.type));
    if (!alreadyRaisedSymbols.has(symbol) &&
        !isWrittenInInnerFunction(symbol, enclosingFunction) &&
        (0, helpers_1.isUndefinedOrNull)(node, context.parserServices)) {
        alreadyRaisedSymbols.add(symbol);
        context.report({
            messageId: 'nullDereference',
            data: {
                symbol: node.name,
            },
            node,
        });
    }
}
//# sourceMappingURL=null-dereference.js.map