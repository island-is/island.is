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
exports.buildSourceCode = void 0;
const helpers_1 = require("helpers");
const build_js_1 = require("./build-js");
const build_ts_1 = require("./build-ts");
const build_vue_1 = require("./build-vue");
/**
 * Builds an ESLint SourceCode for JavaScript / TypeScript
 *
 * This functions routes the parsing of the input based on the input language,
 * the file extension, and some contextual information.
 *
 * @param input the JavaScript / TypeScript analysis input
 * @param language the language of the input
 * @returns the parsed source code
 */
function buildSourceCode(input, language) {
    const isVueFile = input.filePath.endsWith('.vue');
    if (language === 'ts') {
        return (0, build_ts_1.buildTs)(input, isVueFile);
    }
    const tryTypeScriptParser = shouldTryTypeScriptParser();
    if (isVueFile) {
        return (0, build_vue_1.buildVue)(input, tryTypeScriptParser);
    }
    else {
        return (0, build_js_1.buildJs)(input, tryTypeScriptParser);
    }
}
exports.buildSourceCode = buildSourceCode;
function shouldTryTypeScriptParser() {
    const context = (0, helpers_1.getContext)();
    return context ? context.shouldUseTypeScriptParserForJS : true;
}
//# sourceMappingURL=build.js.map