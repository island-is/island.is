"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.last = exports.flatMap = exports.sortLike = exports.writingMethods = exports.collectionConstructor = void 0;
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
exports.collectionConstructor = ['Array', 'Map', 'Set', 'WeakSet', 'WeakMap'];
exports.writingMethods = [
    // array methods
    'copyWithin',
    'fill',
    'pop',
    'push',
    'reverse',
    'set',
    'shift',
    'sort',
    'splice',
    'unshift',
    // map, set methods
    'add',
    'clear',
    'delete',
];
exports.sortLike = ['sort', '"sort"', "'sort'"];
function flatMap(xs, f) {
    const acc = [];
    for (const x of xs) {
        acc.push(...f(x));
    }
    return acc;
}
exports.flatMap = flatMap;
function last(arr) {
    return arr[arr.length - 1];
}
exports.last = last;
//# sourceMappingURL=collection.js.map