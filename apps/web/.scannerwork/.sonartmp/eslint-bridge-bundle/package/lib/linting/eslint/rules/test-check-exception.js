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
// https://sonarsource.github.io/rspec/#/rspec/S5958/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    create(context) {
        let catchWithDone = false;
        function isInsideTest() {
            return context
                .getAncestors()
                .some(n => n.type === 'CallExpression' && helpers_1.Mocha.isTestConstruct(n));
        }
        return {
            'CatchClause CallExpression[callee.name="done"]': (_node) => {
                catchWithDone = true;
            },
            'CatchClause:exit': (node) => {
                if (!catchWithDone || !isInsideTest()) {
                    return;
                }
                catchWithDone = false;
                const { param } = node;
                if (param && param.type === 'Identifier') {
                    const exception = (0, helpers_1.getVariableFromIdentifier)(param, context.getScope());
                    if (exception && exception.references.length === 0) {
                        context.report({
                            node: param,
                            message: 'Either the exception should be passed to "done(e)", or the exception should be tested further.',
                        });
                    }
                }
            },
            CallExpression(node) {
                const callExpr = node;
                if (isInsideTest() &&
                    isThrowAssertWithoutNot(callExpr) &&
                    (callExpr.arguments.length === 0 ||
                        (callExpr.arguments.length === 1 && (0, helpers_1.isIdentifier)(callExpr.arguments[0], 'Error')))) {
                    context.report({
                        node: callExpr.callee.property,
                        message: 'Assert more concrete exception type or assert the message of exception.',
                    });
                }
            },
        };
    },
};
// find nodes in shape expect(...).a.b.c.throw() or a.should.throw()
function isThrowAssertWithoutNot(node) {
    if (node.callee.type !== 'MemberExpression') {
        return false;
    }
    let { object, property } = node.callee;
    if (!(0, helpers_1.isIdentifier)(property, 'throw')) {
        return false;
    }
    while (object.type === 'MemberExpression') {
        if ((0, helpers_1.isIdentifier)(object.property, 'not')) {
            return false;
        }
        if ((0, helpers_1.isIdentifier)(object.property, 'should')) {
            return true;
        }
        object = object.object;
    }
    return object.type === 'CallExpression' && (0, helpers_1.isIdentifier)(object.callee, 'expect');
}
//# sourceMappingURL=test-check-exception.js.map