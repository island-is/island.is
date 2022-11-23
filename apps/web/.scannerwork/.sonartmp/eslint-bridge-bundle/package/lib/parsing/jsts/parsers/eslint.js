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
exports.clearTypeScriptESLintParserCaches = exports.parsers = void 0;
const babelESLintParser = __importStar(require("@babel/eslint-parser"));
const vueESLintParser = __importStar(require("vue-eslint-parser"));
const typescriptESLintParser = __importStar(require("@typescript-eslint/parser"));
/**
 * The ESLint-based parsers used to parse JavaScript, TypeScript, and Vue.js code.
 */
exports.parsers = {
    javascript: { parser: '@babel/eslint-parser', parse: babelESLintParser.parseForESLint },
    typescript: {
        parser: '@typescript-eslint/parser',
        parse: typescriptESLintParser.parseForESLint,
    },
    vuejs: { parser: 'vue-eslint-parser', parse: vueESLintParser.parseForESLint },
};
/**
 * Clears TypeScript ESLint parser's caches
 *
 * While analyzing multiple files that used TypeScript ESLint parser to
 * parse their respective code, raised issues may differ depending on
 * clearing or not TypeScript ESLint parser's caches. To address that,
 * the sensor requests clearing the caches for each considered TSConfig.
 */
function clearTypeScriptESLintParserCaches() {
    typescriptESLintParser.clearCaches();
}
exports.clearTypeScriptESLintParserCaches = clearTypeScriptESLintParserCaches;
//# sourceMappingURL=eslint.js.map