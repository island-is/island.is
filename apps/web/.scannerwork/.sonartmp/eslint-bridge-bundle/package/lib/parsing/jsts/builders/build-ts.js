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
exports.buildTs = void 0;
const jsts_1 = require("parsing/jsts");
/**
 * Builds an instance of ESLint SourceCode for TypeScript
 *
 * Building an ESLint SourceCode for TypeScript implies parsing TypeScript code with
 * TypeScript ESLint parser. However, if the source code denotes TypeScript code in
 * Vue.js Single File Components, Vue.js ESLint parser is used instead to parse the
 * whole file. Furthermore, it is configured to use TypeScript ESLint parser to parse
 * the contents of the 'script' section of the component.
 *
 * @param input the TypeScript analysis input
 * @param isVueFile a flag to indicate if the input denotes Vue.js TypeScript code
 * @returns the parsed TypeScript code
 */
function buildTs(input, isVueFile) {
    const options = (0, jsts_1.buildParserOptions)(input, false, isVueFile ? jsts_1.parsers.typescript.parser : undefined);
    const parse = isVueFile ? jsts_1.parsers.vuejs.parse : jsts_1.parsers.typescript.parse;
    return (0, jsts_1.parseForESLint)(input, parse, options);
}
exports.buildTs = buildTs;
//# sourceMappingURL=build-ts.js.map