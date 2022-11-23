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
exports.parseForESLint = void 0;
const errors_1 = require("errors");
const eslint_1 = require("eslint");
const helpers_1 = require("helpers");
/**
 * Parses a JavaScript / TypeScript analysis input with an ESLint-based parser
 * @param input the JavaScript / TypeScript input to parse
 * @param parse the ESLint parsing function to use for parsing
 * @param options the ESLint parser options
 * @returns the parsed source code
 */
function parseForESLint(input, parse, options) {
    const { fileContent, filePath } = input;
    try {
        const code = fileContent || (0, helpers_1.readFile)(filePath);
        const result = parse(code, options);
        return new eslint_1.SourceCode({
            ...result,
            text: code,
            parserServices: result.services,
        });
    }
    catch ({ lineNumber, message }) {
        if (message.startsWith('Debug Failure')) {
            throw errors_1.APIError.failingTypeScriptError(message);
        }
        else {
            throw errors_1.APIError.parsingError(message, { line: lineNumber });
        }
    }
}
exports.parseForESLint = parseForESLint;
//# sourceMappingURL=parse.js.map