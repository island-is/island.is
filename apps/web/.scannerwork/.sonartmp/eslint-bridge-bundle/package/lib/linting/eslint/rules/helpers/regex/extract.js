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
exports.getParsedRegex = void 0;
const regexpp = __importStar(require("regexpp"));
const helpers_1 = require("linting/eslint/rules/helpers");
const ast_1 = require("./ast");
const flags_1 = require("./flags");
function getParsedRegex(node, context) {
    const patternAndFlags = getPatternFromNode(node, context);
    if (patternAndFlags) {
        try {
            return regexpp.parseRegExpLiteral(new RegExp(patternAndFlags.pattern, patternAndFlags.flags));
        }
        catch (_a) {
            // do nothing for invalid regex
        }
    }
    return null;
}
exports.getParsedRegex = getParsedRegex;
function getPatternFromNode(node, context) {
    var _a;
    if ((0, ast_1.isRegExpConstructor)(node)) {
        const patternOnly = getPatternFromNode(node.arguments[0], context);
        const flags = (0, flags_1.getFlags)(node);
        if (patternOnly && flags !== null) {
            return { pattern: patternOnly.pattern, flags };
        }
    }
    else if ((0, helpers_1.isRegexLiteral)(node)) {
        return node.regex;
    }
    else if ((0, helpers_1.isStringLiteral)(node)) {
        return { pattern: node.value, flags: '' };
    }
    else if ((0, helpers_1.isStaticTemplateLiteral)(node)) {
        return { pattern: node.quasis[0].value.raw, flags: '' };
    }
    else if ((0, helpers_1.isIdentifier)(node)) {
        const assignedExpression = (0, helpers_1.getUniqueWriteUsage)(context, node.name);
        if (assignedExpression &&
            ((_a = assignedExpression.parent) === null || _a === void 0 ? void 0 : _a.type) === 'VariableDeclarator') {
            return getPatternFromNode(assignedExpression, context);
        }
    }
    else if ((0, helpers_1.isBinaryPlus)(node)) {
        const left = getPatternFromNode(node.left, context);
        const right = getPatternFromNode(node.right, context);
        if (left && right) {
            return { pattern: left.pattern + right.pattern, flags: '' };
        }
    }
    return null;
}
//# sourceMappingURL=extract.js.map