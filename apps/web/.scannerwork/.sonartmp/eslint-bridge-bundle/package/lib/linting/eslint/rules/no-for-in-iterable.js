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
// https://sonarsource.github.io/rspec/#/rspec/S4139/javascript
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const typescript_1 = __importDefault(require("typescript"));
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            useForOf: 'Use "for...of" to iterate over this "{{iterable}}".',
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            ForInStatement: (node) => {
                const type = (0, helpers_1.getTypeFromTreeNode)(node.right, services);
                if (isIterable(type)) {
                    const iterable = type.symbol ? type.symbol.name : 'String';
                    context.report({
                        messageId: 'useForOf',
                        data: { iterable },
                        loc: context.getSourceCode().getFirstToken(node).loc,
                    });
                }
            },
        };
    },
};
function isIterable(type) {
    return isCollection(type) || isString(type);
}
function isCollection(type) {
    return (type.symbol !== undefined &&
        [
            'Array',
            'Int8Array',
            'Uint8Array',
            'Uint8ClampedArray',
            'Int16Array',
            'Uint16Array',
            'Int32Array',
            'Uint32Array',
            'Float32Array',
            'Float64Array',
            'BigInt64Array',
            'BigUint64Array',
            'Set',
            'Map',
        ].includes(type.symbol.name));
}
function isString(type) {
    return ((type.symbol !== undefined && type.symbol.name === 'String') ||
        (type.flags & typescript_1.default.TypeFlags.StringLike) !== 0);
}
//# sourceMappingURL=no-for-in-iterable.js.map