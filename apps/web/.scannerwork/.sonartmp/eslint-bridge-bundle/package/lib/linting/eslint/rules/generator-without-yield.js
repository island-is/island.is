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
// https://sonarsource.github.io/rspec/#/rspec/S3531/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const locations_1 = require("eslint-plugin-sonarjs/lib/utils/locations");
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            addYield: 'Add a "yield" statement to this generator.',
        },
    },
    create(context) {
        const yieldStack = [];
        function enterFunction() {
            yieldStack.push(0);
        }
        function exitFunction(node) {
            const functionNode = node;
            const countYield = yieldStack.pop();
            if (countYield === 0 && functionNode.body.body.length > 0) {
                context.report({
                    messageId: 'addYield',
                    loc: (0, locations_1.getMainFunctionTokenLocation)(functionNode, (0, helpers_1.getParent)(context), context),
                });
            }
        }
        return {
            ':function[generator=true]': enterFunction,
            ':function[generator=true]:exit': exitFunction,
            YieldExpression() {
                if (yieldStack.length > 0) {
                    yieldStack[yieldStack.length - 1] += 1;
                }
            },
        };
    },
};
//# sourceMappingURL=generator-without-yield.js.map