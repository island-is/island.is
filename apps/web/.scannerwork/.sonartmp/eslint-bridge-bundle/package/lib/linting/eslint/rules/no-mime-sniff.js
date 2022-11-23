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
// https://sonarsource.github.io/rspec/#/rspec/S5734/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const HELMET = 'helmet';
const NO_SNIFF = 'noSniff';
exports.rule = helpers_1.Express.SensitiveMiddlewarePropertyRule(findFalseNoSniffPropertyFromHelmet, `Make sure allowing browsers to sniff MIME types is safe here.`);
/**
 * Looks for property `noSniff: false` in node looking
 * somewhat similar to `helmet(<options>?)`, and returns it.
 */
function findFalseNoSniffPropertyFromHelmet(context, node) {
    var _a;
    let sensitive;
    const { callee, arguments: args } = node;
    if (callee.type === 'Identifier' &&
        ((_a = (0, helpers_1.getModuleNameOfNode)(context, callee)) === null || _a === void 0 ? void 0 : _a.value) === HELMET &&
        args.length === 1 &&
        args[0].type === 'ObjectExpression') {
        sensitive = (0, helpers_1.getPropertyWithValue)(context, args[0], NO_SNIFF, false);
    }
    return sensitive ? [sensitive] : [];
}
//# sourceMappingURL=no-mime-sniff.js.map