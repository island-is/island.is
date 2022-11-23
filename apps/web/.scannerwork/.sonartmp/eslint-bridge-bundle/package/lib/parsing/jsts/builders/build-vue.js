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
exports.buildVue = void 0;
const helpers_1 = require("helpers");
const jsts_1 = require("parsing/jsts");
/**
 * Builds an instance of ESLint SourceCode for Vue.js
 *
 * Building an ESLint SourceCode for Vue.js implies parsing the 'script' section of
 * a Vue.js Single Component (.vue) file. To this end, we use 'vue-eslint-parser',
 * which is instructed to parse that section either with TypeScript ESLint parser or
 * Babel parser. Furthermore, the Vue.js parser is also able to parse the 'template'
 * section of a .vue file.
 *
 * @param input the Vue.js JavaScript analysis input
 * @param tryTypeScriptESLintParser a flag for parsing with TypeScript ESLint parser
 * @returns the parsed Vue.js JavaScript code
 */
function buildVue(input, tryTypeScriptESLintParser) {
    if (tryTypeScriptESLintParser) {
        try {
            const options = (0, jsts_1.buildParserOptions)(input, false, jsts_1.parsers.typescript.parser);
            return (0, jsts_1.parseForESLint)(input, jsts_1.parsers.vuejs.parse, options);
        }
        catch (error) {
            (0, helpers_1.debug)(`Failed to parse ${input.filePath} with TypeScript parser: ${error.message}`);
        }
    }
    const options = (0, jsts_1.buildParserOptions)(input, true, jsts_1.parsers.javascript.parser);
    return (0, jsts_1.parseForESLint)(input, jsts_1.parsers.vuejs.parse, options);
}
exports.buildVue = buildVue;
//# sourceMappingURL=build-vue.js.map