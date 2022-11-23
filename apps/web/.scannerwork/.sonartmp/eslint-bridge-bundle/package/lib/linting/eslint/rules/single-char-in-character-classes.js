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
// https://sonarsource.github.io/rspec/#/rspec/S6397/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const regex_1 = require("./helpers/regex");
const FORBIDDEN_TYPES = [
    'EscapeCharacterSet',
    'UnicodePropertyCharacterSet',
    'Character',
    'CharacterSet',
];
const EXCEPTION_META_CHARACTERS = '[{(.?+*$^\\\\';
exports.rule = (0, regex_1.createRegExpRule)(context => {
    return {
        onCharacterClassEnter: (node) => {
            if (hasSingleForbiddenCharacter(node.elements) && !node.negate) {
                context.reportRegExpNode({
                    messageId: 'issue',
                    node: context.node,
                    regexpNode: node,
                });
            }
        },
    };
}, {
    meta: {
        messages: {
            issue: 'Replace this character class by the character itself.',
        },
    },
});
function hasSingleForbiddenCharacter(elems) {
    return (elems.length === 1 &&
        FORBIDDEN_TYPES.includes(elems[0].type) &&
        !EXCEPTION_META_CHARACTERS.includes(elems[0].raw));
}
//# sourceMappingURL=single-char-in-character-classes.js.map