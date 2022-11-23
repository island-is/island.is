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
// https://sonarsource.github.io/rspec/#/rspec/S1472/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    meta: {
        messages: {
            moveArguments: 'Make those call arguments start on line {{line}}.',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => {
                const call = node;
                if (call.callee.type !== 'CallExpression' && call.arguments.length === 1) {
                    const sourceCode = context.getSourceCode();
                    const parenthesis = sourceCode.getLastTokenBetween(call.callee, call.arguments[0], token => token.type === 'Punctuator' && token.value === ')');
                    const calleeLastLine = (parenthesis ? parenthesis : sourceCode.getLastToken(call.callee))
                        .loc.end.line;
                    const { start } = sourceCode.getTokenAfter(call.callee).loc;
                    if (calleeLastLine !== start.line) {
                        const { end } = sourceCode.getLastToken(call).loc;
                        if (end.line !== start.line) {
                            //If arguments span multiple lines, we only report the first one
                            reportIssue(start, calleeLastLine, context);
                        }
                        else {
                            reportIssue({ start, end }, calleeLastLine, context);
                        }
                    }
                }
            },
        };
    },
};
function reportIssue(loc, line, context) {
    context.report({
        messageId: 'moveArguments',
        data: {
            line: line.toString(),
        },
        loc,
    });
}
//# sourceMappingURL=call-argument-line.js.map