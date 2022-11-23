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
// https://sonarsource.github.io/rspec/#/rspec/S4817/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const xpathModule = 'xpath';
const xpathEvalMethods = ['select', 'select1', 'evaluate'];
const ieEvalMethods = ['selectNodes', 'SelectSingleNode'];
exports.rule = {
    meta: {
        messages: {
            checkXPath: 'Make sure that executing this XPATH expression is safe.',
        },
    },
    create(context) {
        return {
            MemberExpression: (node) => {
                if ((0, helpers_1.isMemberExpression)(node, 'document', 'evaluate')) {
                    context.report({ messageId: 'checkXPath', node });
                }
            },
            CallExpression: (node) => checkCallExpression(node, context),
        };
    },
};
function checkCallExpression({ callee, arguments: args }, context) {
    if (args.length > 0 && (0, helpers_1.isLiteral)(args[0])) {
        return;
    }
    // IE
    if ((0, helpers_1.isMemberWithProperty)(callee, ...ieEvalMethods) && args.length === 1) {
        context.report({ messageId: 'checkXPath', node: callee });
        return;
    }
    // Document.evaluate
    if ((0, helpers_1.isMemberWithProperty)(callee, 'evaluate') &&
        !(0, helpers_1.isMemberExpression)(callee, 'document', 'evaluate') &&
        args.length >= 4) {
        const resultTypeArgument = args[3];
        const argumentAsText = context.getSourceCode().getText(resultTypeArgument);
        if (argumentAsText.includes('XPathResult')) {
            context.report({ messageId: 'checkXPath', node: callee });
            return;
        }
    }
    // "xpath" module
    const { module, method } = (0, helpers_1.getModuleAndCalledMethod)(callee, context);
    if (method &&
        module &&
        module.value === xpathModule &&
        method.type === 'Identifier' &&
        xpathEvalMethods.includes(method.name)) {
        context.report({ messageId: 'checkXPath', node: callee });
    }
}
//# sourceMappingURL=xpath.js.map