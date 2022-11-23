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
exports.childrenOf = exports.visit = void 0;
/**
 * Visits the abstract syntax tree of an ESLint source code
 * @param sourceCode the source code to visit
 * @param callback a callback function invoked at each node visit
 */
function visit(sourceCode, callback) {
    const stack = [sourceCode.ast];
    while (stack.length) {
        const node = stack.pop();
        callback(node);
        stack.push(...childrenOf(node, sourceCode.visitorKeys).reverse());
    }
}
exports.visit = visit;
/**
 * Returns the direct children of a node
 * @param node the node to get the children
 * @param visitorKeys the visitor keys provided by the source code
 * @returns the node children
 */
function childrenOf(node, visitorKeys) {
    const keys = visitorKeys[node.type];
    const children = [];
    if (keys) {
        for (const key of keys) {
            /**
             * A node's child may be a node or an array of nodes, e.g., `body` in `estree.Program`.
             * If it's an array, we extract all the nodes from it; if not, we just add the node.
             */
            const child = node[key];
            if (Array.isArray(child)) {
                children.push(...child);
            }
            else {
                children.push(child);
            }
        }
    }
    return children.filter(Boolean);
}
exports.childrenOf = childrenOf;
//# sourceMappingURL=visitor.js.map