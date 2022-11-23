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
// https://sonarsource.github.io/rspec/#/rspec/S4123/javascript
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const ts = __importStar(require("typescript"));
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            refactorAwait: "Refactor this redundant 'await' on a non-promise.",
        },
    },
    create(context) {
        const services = context.parserServices;
        if ((0, helpers_1.isRequiredParserServices)(services)) {
            return {
                AwaitExpression: (node) => {
                    const awaitedType = (0, helpers_1.getTypeFromTreeNode)(node.argument, services);
                    if (!hasThenMethod(awaitedType) && !isAny(awaitedType) && !isUnion(awaitedType)) {
                        context.report({
                            messageId: 'refactorAwait',
                            node,
                        });
                    }
                },
            };
        }
        return {};
    },
};
function hasThenMethod(type) {
    var _a;
    const thenProperty = type.getProperty('then');
    return (_a = thenProperty === null || thenProperty === void 0 ? void 0 : thenProperty.declarations) === null || _a === void 0 ? void 0 : _a.some(d => d.kind === ts.SyntaxKind.MethodSignature || d.kind === ts.SyntaxKind.MethodDeclaration);
}
function isAny(type) {
    return Boolean(type.flags & ts.TypeFlags.Any);
}
function isUnion(type) {
    return Boolean(type.flags & ts.TypeFlags.Union);
}
//# sourceMappingURL=no-invalid-await.js.map