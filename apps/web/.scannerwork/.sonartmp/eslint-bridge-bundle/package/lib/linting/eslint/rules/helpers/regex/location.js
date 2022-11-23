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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegexpLocation = void 0;
const helpers_1 = require("linting/eslint/rules/helpers");
const range_1 = require("./range");
/**
 * Gets the regexp node location in the ESLint referential
 * @param node the ESLint regex node
 * @param regexpNode the regexp regex node
 * @param context the rule context
 * @param offset an offset to apply on the location
 * @returns the regexp node location in the ESLint referential
 */
function getRegexpLocation(node, regexpNode, context, offset = [0, 0]) {
    let loc;
    if ((0, helpers_1.isRegexLiteral)(node) || (0, helpers_1.isStringLiteral)(node)) {
        const source = context.getSourceCode();
        const [start] = node.range;
        const [reStart, reEnd] = (0, range_1.getRegexpRange)(node, regexpNode);
        loc = {
            start: source.getLocFromIndex(start + reStart + offset[0]),
            end: source.getLocFromIndex(start + reEnd + offset[1]),
        };
    }
    else {
        loc = node.loc;
    }
    return loc;
}
exports.getRegexpLocation = getRegexpLocation;
//# sourceMappingURL=location.js.map