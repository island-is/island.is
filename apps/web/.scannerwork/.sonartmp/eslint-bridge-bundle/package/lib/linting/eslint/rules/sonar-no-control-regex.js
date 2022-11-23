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
// https://sonarsource.github.io/rspec/#/rspec/S6324/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const regex_1 = require("./helpers/regex");
exports.rule = (0, regex_1.createRegExpRule)(context => {
    return {
        onCharacterEnter: (character) => {
            const { value, raw } = character;
            if (value >= 0x00 && value <= 0x1f && (raw.startsWith('\\x') || raw.startsWith('\\u'))) {
                context.reportRegExpNode({
                    message: `Remove this control character: ${character.raw}.`,
                    node: context.node,
                    regexpNode: character,
                });
            }
        },
    };
});
//# sourceMappingURL=sonar-no-control-regex.js.map