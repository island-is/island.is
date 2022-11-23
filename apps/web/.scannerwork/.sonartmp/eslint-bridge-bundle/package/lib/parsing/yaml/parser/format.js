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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupportedFormat = exports.SUPPORTED_STRING_FORMATS = exports.BLOCK_LITERAL_FORMAT = exports.BLOCK_FOLDED_FORMAT = exports.PLAIN_FORMAT = void 0;
/**
 * YAML string formats given by the YAML parser
 */
_a = [
    'PLAIN',
    'BLOCK_FOLDED',
    'BLOCK_LITERAL',
], exports.PLAIN_FORMAT = _a[0], exports.BLOCK_FOLDED_FORMAT = _a[1], exports.BLOCK_LITERAL_FORMAT = _a[2];
/**
 * The list of supported YAML string formats
 */
exports.SUPPORTED_STRING_FORMATS = [exports.PLAIN_FORMAT, exports.BLOCK_FOLDED_FORMAT, exports.BLOCK_LITERAL_FORMAT];
/**
 * Checks if the node denotes a supported YAML string format
 */
function isSupportedFormat(pair) {
    var _a;
    return exports.SUPPORTED_STRING_FORMATS.includes((_a = pair.value) === null || _a === void 0 ? void 0 : _a.type);
}
exports.isSupportedFormat = isSupportedFormat;
//# sourceMappingURL=format.js.map