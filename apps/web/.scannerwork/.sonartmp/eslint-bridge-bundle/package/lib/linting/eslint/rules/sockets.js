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
// https://sonarsource.github.io/rspec/#/rspec/S4818/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const NET_MODULE = 'net';
const SOCKET_CREATION_FUNCTIONS = new Set(['createConnection', 'connect']);
const SOCKET_CONSTRUCTOR = 'Socket';
exports.rule = {
    meta: {
        messages: {
            safeSocket: 'Make sure that sockets are used safely here.',
        },
    },
    create(context) {
        return {
            NewExpression: (node) => checkCallExpression(node, context),
            CallExpression: (node) => checkCallExpression(node, context),
        };
    },
};
function checkCallExpression({ callee, type }, context) {
    let moduleName;
    let expression;
    if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier') {
        moduleName = (0, helpers_1.getModuleNameOfIdentifier)(context, callee.object);
        expression = callee.property;
    }
    if (callee.type === 'Identifier') {
        moduleName = (0, helpers_1.getModuleNameOfImportedIdentifier)(context, callee);
        expression = callee;
    }
    if (expression && isQuestionable(expression, type === 'NewExpression', moduleName)) {
        context.report({ messageId: 'safeSocket', node: callee });
    }
}
function isQuestionable(expression, isConstructor, moduleName) {
    if (!moduleName || moduleName.value !== NET_MODULE || expression.type !== 'Identifier') {
        return false;
    }
    if (isConstructor) {
        return expression.name === SOCKET_CONSTRUCTOR;
    }
    return SOCKET_CREATION_FUNCTIONS.has(expression.name);
}
//# sourceMappingURL=sockets.js.map