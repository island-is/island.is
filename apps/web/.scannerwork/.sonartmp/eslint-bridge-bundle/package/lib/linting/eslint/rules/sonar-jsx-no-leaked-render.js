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
// https://sonarsource.github.io/rspec/#/rspec/S6439/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const detectReactNativeSelector = [
    ':matches(',
    [
        'CallExpression[callee.name="require"][arguments.0.value="react-native"]',
        'ImportDeclaration[source.value="react-native"]',
    ].join(','),
    ')',
].join('');
exports.rule = {
    meta: {
        hasSuggestions: true,
        messages: {
            nonBooleanMightRender: 'Convert the conditional to a boolean to avoid leaked value',
            suggestConversion: 'Convert the conditional to a boolean',
        },
    },
    create(context) {
        if (!(0, helpers_1.isRequiredParserServices)(context.parserServices)) {
            return {};
        }
        let usesReactNative = false;
        return {
            [detectReactNativeSelector]() {
                usesReactNative = true;
            },
            'JSXExpressionContainer > LogicalExpression[operator="&&"]'(node) {
                const leftSide = node.left;
                checkNonBoolean(context, usesReactNative ? isStringOrNumber : isNumber, leftSide);
            },
        };
    },
};
function report(node, context) {
    context.report({
        messageId: 'nonBooleanMightRender',
        node,
        suggest: [
            {
                messageId: 'suggestConversion',
                fix: fixer => {
                    const sourceCode = context.getSourceCode();
                    const previousToken = sourceCode.getTokenBefore(node);
                    const nextToken = sourceCode.getTokenAfter(node);
                    const fixes = [];
                    if (!!previousToken &&
                        !!nextToken &&
                        node.range !== undefined &&
                        previousToken.value === '(' &&
                        previousToken.range[1] <= node.range[0] &&
                        nextToken.value === ')' &&
                        nextToken.range[0] >= node.range[1]) {
                        fixes.push(fixer.remove(previousToken));
                        fixes.push(fixer.remove(nextToken));
                    }
                    fixes.push(fixer.replaceText(node, `!!(${sourceCode.getText(node)})`));
                    return fixes;
                },
            },
        ],
    });
}
function isStringOrNumber(node, context) {
    const type = (0, helpers_1.getTypeFromTreeNode)(node, context.parserServices);
    return (0, helpers_1.isStringType)(type) || (0, helpers_1.isBigIntType)(type) || (0, helpers_1.isNumberType)(type);
}
function isNumber(node, context) {
    const type = (0, helpers_1.getTypeFromTreeNode)(node, context.parserServices);
    return (0, helpers_1.isBigIntType)(type) || (0, helpers_1.isNumberType)(type);
}
function checkNonBoolean(context, isLeakingType, node) {
    if (node.type === 'LogicalExpression') {
        checkNonBoolean(context, isLeakingType, node.left);
        checkNonBoolean(context, isLeakingType, node.right);
    }
    else if (isLeakingType(node, context)) {
        report(node, context);
    }
}
//# sourceMappingURL=sonar-jsx-no-leaked-render.js.map