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
// https://sonarsource.github.io/rspec/#/rspec/S5691/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const SERVE_STATIC = 'serve-static';
exports.rule = {
    meta: {
        messages: {
            safeHiddenFile: 'Make sure serving hidden files is safe here.',
        },
    },
    create(context) {
        return {
            CallExpression(node) {
                const { callee, arguments: args } = node;
                if (callee.type !== 'Identifier') {
                    return;
                }
                // serveStatic(...)
                const module = (0, helpers_1.getModuleNameOfIdentifier)(context, callee);
                if ((module === null || module === void 0 ? void 0 : module.value) === SERVE_STATIC && args.length > 1) {
                    let options = args[1];
                    if (options.type === 'Identifier') {
                        options = (0, helpers_1.getUniqueWriteUsage)(context, options.name);
                    }
                    const dotfilesProperty = (0, helpers_1.getObjectExpressionProperty)(options, 'dotfiles');
                    if ((dotfilesProperty === null || dotfilesProperty === void 0 ? void 0 : dotfilesProperty.value.type) === 'Literal' &&
                        dotfilesProperty.value.value === 'allow') {
                        context.report({ node: dotfilesProperty, messageId: 'safeHiddenFile' });
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=hidden-files.js.map