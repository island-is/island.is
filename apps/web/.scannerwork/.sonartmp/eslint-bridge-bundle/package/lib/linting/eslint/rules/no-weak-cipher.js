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
// https://sonarsource.github.io/rspec/#/rspec/S5547/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const WEAK_CIPHERS = ['bf', 'blowfish', 'des', 'rc2', 'rc4'];
exports.rule = {
    meta: {
        messages: {
            strongerCipher: 'Use a strong cipher algorithm.',
        },
    },
    create(context) {
        return {
            CallExpression(node) {
                var _a;
                const callExpression = node;
                if ((0, helpers_1.isCallToFQN)(context, callExpression, 'crypto', 'createCipheriv')) {
                    const algorithm = (0, helpers_1.getValueOfExpression)(context, callExpression.arguments[0], 'Literal');
                    const algorithmValue = (_a = algorithm === null || algorithm === void 0 ? void 0 : algorithm.value) === null || _a === void 0 ? void 0 : _a.toString().toLowerCase();
                    if (algorithm &&
                        algorithmValue &&
                        WEAK_CIPHERS.findIndex(cipher => algorithmValue.startsWith(cipher)) >= 0) {
                        context.report({
                            messageId: 'strongerCipher',
                            node: algorithm,
                        });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=no-weak-cipher.js.map