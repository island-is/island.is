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
// https://sonarsource.github.io/rspec/#/rspec/S5042/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const ADM_ZIP = 'adm-zip';
exports.rule = {
    meta: {
        messages: {
            safeExpanding: 'Make sure that expanding this archive file is safe here.',
        },
    },
    create(context) {
        function canBeProperty(prop, name) {
            return (prop.type === 'SpreadElement' ||
                (0, helpers_1.isIdentifier)(prop.key, name) ||
                ((0, helpers_1.isLiteral)(prop.key) && prop.key.value === name));
        }
        function isCallToAdmZipExtractAll({ callee }) {
            return callee.type === 'MemberExpression' && (0, helpers_1.isIdentifier)(callee.property, 'extractAllTo');
        }
        function isAdmZipLibraryInScope() {
            return isAdmZipLibraryImported() || isAdmZipLibraryRequired();
        }
        function isAdmZipLibraryImported() {
            return (0, helpers_1.getImportDeclarations)(context).some(i => i.source.value === ADM_ZIP);
        }
        function isAdmZipLibraryRequired() {
            return (0, helpers_1.getRequireCalls)(context).some(r => r.arguments[0].type === 'Literal' && r.arguments[0].value === ADM_ZIP);
        }
        function isSensiteTarCall(call) {
            if ((0, helpers_1.isCallToFQN)(context, call, 'tar', 'x')) {
                const firstArg = call.arguments.length > 0 ? call.arguments[0] : null;
                if (!firstArg) {
                    return false;
                }
                const firstArgValue = (0, helpers_1.getValueOfExpression)(context, firstArg, 'ObjectExpression');
                return (!!firstArgValue && !firstArgValue.properties.some(prop => canBeProperty(prop, 'filter')));
            }
            return false;
        }
        function isSensiteExtractZipCall(call) {
            var _a;
            if (call.callee.type === 'Identifier' &&
                ((_a = (0, helpers_1.getModuleNameOfIdentifier)(context, call.callee)) === null || _a === void 0 ? void 0 : _a.value) === 'extract-zip') {
                const secondArg = call.arguments.length > 1 ? call.arguments[1] : null;
                if (!secondArg) {
                    return false;
                }
                const secondArgValue = (0, helpers_1.getValueOfExpression)(context, secondArg, 'ObjectExpression');
                return (!!secondArgValue &&
                    !secondArgValue.properties.some(prop => canBeProperty(prop, 'onEntry')));
            }
            return false;
        }
        return {
            CallExpression(node) {
                const call = node;
                if (isSensiteTarCall(call) ||
                    (isCallToAdmZipExtractAll(call) && isAdmZipLibraryInScope()) ||
                    (0, helpers_1.isCallToFQN)(context, call, 'jszip', 'loadAsync') ||
                    (0, helpers_1.isCallToFQN)(context, call, 'yauzl', 'open') ||
                    isSensiteExtractZipCall(call)) {
                    context.report({
                        messageId: 'safeExpanding',
                        node: call.callee,
                    });
                }
            },
        };
    },
};
//# sourceMappingURL=no-unsafe-unzip.js.map