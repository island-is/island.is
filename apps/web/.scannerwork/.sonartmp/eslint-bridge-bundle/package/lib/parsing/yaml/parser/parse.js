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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYaml = void 0;
const yaml = __importStar(require("yaml"));
const assert_1 = __importDefault(require("assert"));
const helpers_1 = require("helpers");
const format_1 = require("./format");
const errors_1 = require("errors");
/**
 * Parses YAML file and extracts JS code according to the provided predicate
 */
function parseYaml(parsingContexts, filePath) {
    const text = (0, helpers_1.readFile)(filePath);
    /**
     * Builds the abstract syntax tree of the YAML file
     *
     * YAML supports a marker "---" that indicates the end of a document: a file may contain multiple documents.
     * This means that it can return multiple abstract syntax trees.
     */
    const lineCounter = new yaml.LineCounter();
    const tokens = new yaml.Parser(lineCounter.addNewLine).parse(text);
    const docs = new yaml.Composer({ keepSourceTokens: true }).compose(tokens);
    const embeddedJSs = [];
    for (const doc of docs) {
        /**
         * Although there could be multiple parsing errors in the YAML file, we only consider
         * the first error to be consistent with how parsing errors are returned when parsing
         * standalone JavaScript source files.
         */
        if (doc.errors.length > 0) {
            const error = doc.errors[0];
            throw errors_1.APIError.parsingError(error.message, { line: lineCounter.linePos(error.pos[0]).line });
        }
        /**
         * Extract the embedded JavaScript snippets from the YAML abstract syntax tree
         */
        yaml.visit(doc, {
            Pair(key, pair, ancestors) {
                for (const currentContext of parsingContexts) {
                    if (currentContext.predicate(key, pair, ancestors) && (0, format_1.isSupportedFormat)(pair)) {
                        const { value, srcToken } = pair;
                        const code = srcToken.value.source;
                        const format = pair.value.type;
                        /**
                         * This assertion should never fail because the visited node denotes either an AWS Lambda
                         * or an AWS Serverless with embedded JavaScript code that can be extracted at this point.
                         */
                        (0, assert_1.default)(code != null, 'An extracted embedded JavaScript snippet should be defined.');
                        const [offsetStart] = value.range;
                        const { line, col: column } = lineCounter.linePos(offsetStart);
                        const lineStarts = lineCounter.lineStarts;
                        embeddedJSs.push({
                            code,
                            line,
                            column,
                            offset: fixOffset(offsetStart, value.type),
                            lineStarts,
                            text,
                            format,
                            extras: currentContext.picker(key, pair, ancestors),
                        });
                    }
                }
            },
        });
    }
    return embeddedJSs;
    /**
     * Fixes the offset of the beginning of the embedded JavaScript snippet in the YAML file,
     * as it changes depending on the type of the embedding format.
     */
    function fixOffset(offset, format) {
        if ([format_1.BLOCK_FOLDED_FORMAT, format_1.BLOCK_LITERAL_FORMAT].includes(format)) {
            /* +1 for the block marker (`>` or `|`) and +1 for the line break */
            return offset + 2;
        }
        else {
            return offset;
        }
    }
}
exports.parseYaml = parseYaml;
//# sourceMappingURL=parse.js.map