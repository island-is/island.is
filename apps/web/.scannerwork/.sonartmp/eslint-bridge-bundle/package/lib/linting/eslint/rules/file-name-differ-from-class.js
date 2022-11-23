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
// https://sonarsource.github.io/rspec/#/rspec/S3317/javascript
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const path_1 = __importDefault(require("path"));
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            renameFile: 'Rename this file to "{{exported}}"',
        },
    },
    create(context) {
        let isOnlyExport = true;
        let nameOfExported = undefined;
        return {
            ExportDefaultDeclaration: (node) => {
                const declaration = node.declaration;
                if (declaration.type === 'Identifier') {
                    const variable = (0, helpers_1.getVariableFromName)(context, declaration.name);
                    if (variable && variable.defs.length === 1) {
                        const def = variable.defs[0];
                        if (def.type === 'ClassName' || def.type === 'FunctionName' || isConst(def)) {
                            nameOfExported = declaration.name;
                        }
                    }
                }
                else if (declaration.type === 'ClassDeclaration' ||
                    declaration.type === 'FunctionDeclaration') {
                    if (declaration.id) {
                        nameOfExported = declaration.id.name;
                    }
                }
            },
            'ExportAllDeclaration, ExportNamedDeclaration': () => {
                isOnlyExport = false;
            },
            'Program:exit': () => {
                if (isOnlyExport && nameOfExported) {
                    const fileName = path_1.default.parse(context.getFilename()).name;
                    if ('index' !== fileName &&
                        !sameName(nameOfExported, fileName) &&
                        !sameName(nameOfExported, sliceOffPostfix(fileName))) {
                        context.report({
                            messageId: 'renameFile',
                            data: {
                                exported: nameOfExported,
                            },
                            loc: { line: 0, column: 0 },
                        });
                    }
                }
            },
        };
    },
};
function sameName(nameOfExported, fileName) {
    const normalizedFileName = fileName.replace(/_/g, '').replace(/-/g, '').replace(/\./g, '');
    const normalizedNameOfExported = nameOfExported.replace(/_/g, '').replace(/-/g, '');
    return normalizedNameOfExported.toLowerCase() === normalizedFileName.toLowerCase();
}
function isConst(def) {
    return def.type === 'Variable' && def.parent && def.parent.kind === 'const';
}
function sliceOffPostfix(fileName) {
    return fileName.slice(0, fileName.lastIndexOf('.'));
}
//# sourceMappingURL=file-name-differ-from-class.js.map