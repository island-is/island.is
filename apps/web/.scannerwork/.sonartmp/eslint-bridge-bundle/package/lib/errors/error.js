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
exports.APIError = exports.ErrorCode = void 0;
/**
 * The possible codes of analysis errors
 *
 * The `Unexpected` value denotes a runtime error which is either
 * unpredictable or occurs rarely to deserve its own category.
 */
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["Parsing"] = "PARSING";
    ErrorCode["FailingTypeScript"] = "FAILING_TYPESCRIPT";
    // We are stuck with this name because of possible external dependents
    ErrorCode["Unexpected"] = "GENERAL_ERROR";
    ErrorCode["LinterInitialization"] = "LINTER_INITIALIZATION";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
class APIError extends Error {
    constructor(code, message, data) {
        super(message);
        this.code = code;
        this.data = data;
    }
    /**
     * Builds a failing TypeScript error.
     */
    static failingTypeScriptError(message) {
        return new APIError(ErrorCode.FailingTypeScript, message);
    }
    /**
     * Builds a linter initialization error.
     */
    static linterError(message) {
        return new APIError(ErrorCode.LinterInitialization, message);
    }
    /**
     * Builds a parsing error.
     */
    static parsingError(message, data) {
        return new APIError(ErrorCode.Parsing, message, data);
    }
    /**
     * Builds an unexpected runtime error.
     */
    static unexpectedError(message) {
        return new APIError(ErrorCode.Unexpected, message);
    }
}
exports.APIError = APIError;
//# sourceMappingURL=error.js.map