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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProgram = exports.createProgram = exports.getProgramById = void 0;
/**
 * This file provides an API to take control over TypeScript's Program instances
 * in the context of program-based analysis for JavaScript / TypeScript.
 *
 * A TypeScript's Program instance is used by TypeScript ESLint parser in order
 * to make available TypeScript's type checker for rules willing to use type
 * information for the sake of precision. It works similarly as using TSConfigs
 * except it gives the control over the lifecycle of this internal data structure
 * used by the parser and improves performance.
 */
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const typescript_1 = __importDefault(require("typescript"));
const helpers_1 = require("helpers");
/**
 * A cache of created TypeScript's Program instances
 *
 * It associates a program identifier to an instance of a TypeScript's Program.
 */
const programs = new Map();
/**
 * A counter of created TypeScript's Program instances
 */
let programCount = 0;
/**
 * Computes the next identifier available for a TypeScript's Program.
 * @returns
 */
function nextId() {
    programCount++;
    return programCount.toString();
}
/**
 * Gets an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to retrieve
 * @throws a runtime error if there is no such program
 * @returns the retrieved TypeScript's Program
 */
function getProgramById(programId) {
    const program = programs.get(programId);
    if (!program) {
        throw Error(`Failed to find program ${programId}`);
    }
    return program;
}
exports.getProgramById = getProgramById;
/**
 * Creates a TypeScript's Program instance
 *
 * TypeScript creates a Program instance per TSConfig file. This means that one
 * needs a TSConfig to create such a program. Therefore, the function expects a
 * TSConfig as an input, parses it and uses it to create a TypeScript's Program
 * instance. The program creation delegates to TypeScript the resolving of input
 * files considered by the TSConfig as well as any project references.
 *
 * @param inputTSConfig the TSConfig input to create a program for
 * @returns the identifier of the created TypeScript's Program along with the
 *          resolved files and project references
 */
function createProgram(inputTSConfig) {
    let tsConfig = inputTSConfig;
    if (fs_1.default.lstatSync(tsConfig).isDirectory()) {
        tsConfig = path_1.default.join(tsConfig, 'tsconfig.json');
    }
    (0, helpers_1.debug)(`creating program from ${tsConfig}`);
    const parseConfigHost = {
        useCaseSensitiveFileNames: true,
        readDirectory: typescript_1.default.sys.readDirectory,
        fileExists: typescript_1.default.sys.fileExists,
        readFile: typescript_1.default.sys.readFile,
    };
    const config = typescript_1.default.readConfigFile(tsConfig, parseConfigHost.readFile);
    if (config.error) {
        console.error(`Failed to parse tsconfig: ${tsConfig} (${diagnosticToString(config.error)})`);
        throw Error(diagnosticToString(config.error));
    }
    const parsedConfigFile = typescript_1.default.parseJsonConfigFileContent(config.config, parseConfigHost, path_1.default.resolve(path_1.default.dirname(tsConfig)), {
        noEmit: true,
    }, tsConfig);
    if (parsedConfigFile.errors.length > 0) {
        const message = parsedConfigFile.errors.map(diagnosticToString).join('; ');
        throw Error(message);
    }
    const programOptions = {
        rootNames: parsedConfigFile.fileNames,
        options: { ...parsedConfigFile.options, allowNonTsExtensions: true },
        projectReferences: parsedConfigFile.projectReferences,
    };
    const program = typescript_1.default.createProgram(programOptions);
    const maybeProjectReferences = program.getProjectReferences();
    const projectReferences = maybeProjectReferences ? maybeProjectReferences.map(p => p.path) : [];
    const files = program.getSourceFiles().map(sourceFile => sourceFile.fileName);
    const programId = nextId();
    programs.set(programId, program);
    (0, helpers_1.debug)(`program from ${tsConfig} with id ${programId} is created`);
    return { programId, files, projectReferences };
}
exports.createProgram = createProgram;
/**
 * Deletes an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to delete
 */
function deleteProgram(programId) {
    programs.delete(programId);
}
exports.deleteProgram = deleteProgram;
function diagnosticToString(diagnostic) {
    var _a;
    const text = typeof diagnostic.messageText === 'string'
        ? diagnostic.messageText
        : diagnostic.messageText.messageText;
    if (diagnostic.file) {
        return `${text}  ${(_a = diagnostic.file) === null || _a === void 0 ? void 0 : _a.fileName}:${diagnostic.start}`;
    }
    else {
        return text;
    }
}
//# sourceMappingURL=program.js.map