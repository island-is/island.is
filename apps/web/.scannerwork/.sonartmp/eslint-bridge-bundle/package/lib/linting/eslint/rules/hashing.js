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
// https://sonarsource.github.io/rspec/#/rspec/S4790/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const message = 'Make sure this weak hash algorithm is not used in a sensitive context here.';
const CRYPTO_UNSECURE_HASH_ALGORITHMS = new Set([
    'md2',
    'md4',
    'md5',
    'md6',
    'haval128',
    'hmacmd5',
    'dsa',
    'ripemd',
    'ripemd128',
    'ripemd160',
    'hmacripemd160',
    'sha1',
]);
const SUBTLE_UNSECURE_HASH_ALGORITHMS = new Set(['sha-1']);
exports.rule = {
    create(context) {
        function checkNodejsCrypto(node) {
            // crypto#createHash
            const { callee, arguments: args } = node;
            const { module, method } = (0, helpers_1.getModuleAndCalledMethod)(callee, context);
            if ((module === null || module === void 0 ? void 0 : module.value) === 'crypto' && (0, helpers_1.isIdentifier)(method, 'createHash')) {
                checkUnsecureAlgorithm(method, args[0], CRYPTO_UNSECURE_HASH_ALGORITHMS);
            }
        }
        function checkSubtleCrypto(node) {
            // crypto.subtle#digest
            const { callee, arguments: args } = node;
            if (callee.type === 'MemberExpression' && (0, helpers_1.isIdentifier)(callee.property, 'digest')) {
                const { object, property: method } = callee;
                if (object.type === 'MemberExpression' &&
                    (0, helpers_1.isIdentifier)(object.object, 'crypto') &&
                    (0, helpers_1.isIdentifier)(object.property, 'subtle')) {
                    checkUnsecureAlgorithm(method, args[0], SUBTLE_UNSECURE_HASH_ALGORITHMS);
                }
            }
        }
        function checkUnsecureAlgorithm(method, hash, unsecureAlgorithms) {
            const hashAlgorithm = (0, helpers_1.getUniqueWriteUsageOrNode)(context, hash);
            if ((0, helpers_1.isStringLiteral)(hashAlgorithm) &&
                unsecureAlgorithms.has(hashAlgorithm.value.toLocaleLowerCase())) {
                context.report({
                    message,
                    node: method,
                });
            }
        }
        return {
            'CallExpression[arguments.length > 0]': (node) => {
                const callExpr = node;
                checkNodejsCrypto(callExpr);
                checkSubtleCrypto(callExpr);
            },
        };
    },
};
//# sourceMappingURL=hashing.js.map