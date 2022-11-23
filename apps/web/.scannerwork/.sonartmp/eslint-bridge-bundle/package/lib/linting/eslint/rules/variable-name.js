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
// https://sonarsource.github.io/rspec/#/rspec/S117/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            renameSymbol: `Rename this {{symbolType}} "{{symbol}}" to match the regular expression {{format}}.`,
        },
    },
    create(context) {
        return {
            VariableDeclaration: (node) => checkVariable(node, context),
            'FunctionDeclaration, FunctionExpression, ArrowFunctionExpression, TSDeclareFunction, TSMethodSignature, TSConstructSignatureDeclaration, TSEmptyBodyFunctionExpression': (node) => checkFunction(node, context),
            PropertyDefinition: (node) => checkProperty(node, context),
            CatchClause: (node) => checkCatch(node, context),
        };
    },
};
function checkVariable(decl, context) {
    if (decl.declare) {
        return;
    }
    decl.declarations.forEach(declaration => (0, helpers_1.resolveIdentifiers)(declaration.id).forEach(id => raiseOnInvalidIdentifier(id, 'local variable', context)));
}
function checkFunction(func, context) {
    if (func.declare) {
        return;
    }
    func.params.forEach(param => (0, helpers_1.resolveIdentifiers)(param).forEach(id => raiseOnInvalidIdentifier(id, 'parameter', context)));
}
function checkProperty(prop, context) {
    if (prop.key.type === 'Identifier') {
        raiseOnInvalidIdentifier(prop.key, 'property', context);
    }
}
function checkCatch(catchh, context) {
    if (catchh.param) {
        (0, helpers_1.resolveIdentifiers)(catchh.param).forEach(id => raiseOnInvalidIdentifier(id, 'parameter', context));
    }
}
function raiseOnInvalidIdentifier(id, idType, context) {
    const [{ format }] = context.options;
    const { name } = id;
    if (!name.match(format)) {
        context.report({
            messageId: 'renameSymbol',
            data: {
                symbol: name,
                symbolType: idType,
                format,
            },
            node: id,
        });
    }
}
//# sourceMappingURL=variable-name.js.map