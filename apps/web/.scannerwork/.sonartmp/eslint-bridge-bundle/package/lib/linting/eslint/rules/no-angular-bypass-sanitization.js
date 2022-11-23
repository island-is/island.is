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
// https://sonarsource.github.io/rspec/#/rspec/S6268/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const bypassMethods = [
    'bypassSecurityTrustHtml',
    'bypassSecurityTrustStyle',
    'bypassSecurityTrustScript',
    'bypassSecurityTrustUrl',
    'bypassSecurityTrustResourceUrl',
];
exports.rule = {
    meta: {
        messages: {
            checkAngularBypass: 'Make sure disabling Angular built-in sanitization is safe here.',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => {
                const { callee, arguments: args } = node;
                if ((0, helpers_1.isMemberWithProperty)(callee, ...bypassMethods) &&
                    args.length === 1 &&
                    !isHardcodedLiteral(args[0])) {
                    context.report({
                        messageId: 'checkAngularBypass',
                        node: callee.property,
                    });
                }
            },
        };
    },
};
function isHardcodedLiteral(node) {
    if (node.type === 'TemplateLiteral') {
        return node.expressions.length === 0;
    }
    else {
        return (0, helpers_1.isLiteral)(node);
    }
}
//# sourceMappingURL=no-angular-bypass-sanitization.js.map