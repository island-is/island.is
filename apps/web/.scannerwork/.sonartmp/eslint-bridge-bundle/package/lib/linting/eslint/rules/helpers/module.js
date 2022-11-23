"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasFullyQualifiedName = exports.getModuleAndCalledMethod = exports.isCallToFQN = exports.getModuleNameFromRequire = exports.getRequireCalls = exports.getImportDeclarations = exports.getModuleNameOfImportedIdentifier = exports.getModuleNameOfNode = exports.getModuleNameOfIdentifier = void 0;
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
const assert_1 = __importDefault(require("assert"));
const ast_1 = require("./ast");
/**
 * Returns the module name, when an identifier either represents a namespace for that module,
 * or is an alias for the default exported value.
 *
 * Returns undefined otherwise.
 * example: Given `import * as X from 'module_name'`, `getModuleNameOfIdentifier(X)`
 * returns `module_name`.
 */
function getModuleNameOfIdentifier(context, identifier) {
    const { name } = identifier;
    // check if importing using `import * as X from 'module_name'`
    const importDeclaration = getImportDeclarations(context).find(importDecl => (0, ast_1.isNamespaceSpecifier)(importDecl, name) || (0, ast_1.isDefaultSpecifier)(importDecl, name));
    if (importDeclaration) {
        return importDeclaration.source;
    }
    // check if importing using `const X = require('module_name')`
    const writeExpression = (0, ast_1.getUniqueWriteUsage)(context, name);
    if (writeExpression) {
        return getModuleNameFromRequire(writeExpression);
    }
    return undefined;
}
exports.getModuleNameOfIdentifier = getModuleNameOfIdentifier;
/**
 * Returns the module name of either a directly `require`d or referenced module in
 * the following cases:
 *
 *  1. If `node` is a `require('m')` call;
 *  2. If `node` is an identifier `i` bound by an import, as in `import i from 'm'`;
 *  3. If `node` is an identifier `i`, and there is a single assignment with a `require`
 *     on the right hand side, i.e. `var i = require('m')`;
 *
 * then, in all three cases, the returned value will be the name of the module `'m'`.
 *
 * @param node the expression that is expected to evaluate to a module
 * @param context the rule context
 * @return literal with the name of the module or `undefined`.
 */
function getModuleNameOfNode(context, node) {
    if (node.type === 'Identifier') {
        return getModuleNameOfIdentifier(context, node);
    }
    else {
        return getModuleNameFromRequire(node);
    }
}
exports.getModuleNameOfNode = getModuleNameOfNode;
/**
 * Returns the module name, when an identifier represents a binding imported from another module.
 * Returns undefined otherwise.
 * example: Given `import { f } from 'module_name'`, `getModuleNameOfImportedIdentifier(f)` returns `module_name`
 */
function getModuleNameOfImportedIdentifier(context, identifier) {
    // check if importing using `import { f } from 'module_name'`
    const importedDeclaration = getImportDeclarations(context).find(({ specifiers }) => specifiers.some(spec => spec.type === 'ImportSpecifier' && spec.imported.name === identifier.name));
    if (importedDeclaration) {
        return importedDeclaration.source;
    }
    // check if importing using `const f = require('module_name').f` or `const { f } = require('module_name')`
    const writeExpression = (0, ast_1.getUniqueWriteUsage)(context, identifier.name);
    if (writeExpression) {
        let maybeRequireCall;
        if (writeExpression.type === 'MemberExpression' &&
            (0, ast_1.isIdentifier)(writeExpression.property, identifier.name)) {
            maybeRequireCall = writeExpression.object;
        }
        else {
            maybeRequireCall = writeExpression;
        }
        return getModuleNameFromRequire(maybeRequireCall);
    }
    return undefined;
}
exports.getModuleNameOfImportedIdentifier = getModuleNameOfImportedIdentifier;
function getImportDeclarations(context) {
    const program = context.getSourceCode().ast;
    if (program.sourceType === 'module') {
        return program.body.filter(node => node.type === 'ImportDeclaration');
    }
    return [];
}
exports.getImportDeclarations = getImportDeclarations;
function getRequireCalls(context) {
    const required = [];
    const { scopeManager } = context.getSourceCode();
    scopeManager.scopes.forEach(scope => scope.variables.forEach(variable => variable.defs.forEach(def => {
        if (def.type === 'Variable' && def.node.init) {
            if (isRequire(def.node.init)) {
                required.push(def.node.init);
            }
            else if (def.node.init.type === 'MemberExpression' && isRequire(def.node.init.object)) {
                required.push(def.node.init.object);
            }
        }
    })));
    return required;
}
exports.getRequireCalls = getRequireCalls;
function isRequire(node) {
    return (node.type === 'CallExpression' &&
        node.callee.type === 'Identifier' &&
        node.callee.name === 'require' &&
        node.arguments.length === 1);
}
function getModuleNameFromRequire(node) {
    if (node.type === 'CallExpression' &&
        (0, ast_1.isIdentifier)(node.callee, 'require') &&
        node.arguments.length === 1) {
        const moduleName = node.arguments[0];
        if (moduleName.type === 'Literal') {
            return moduleName;
        }
    }
    return undefined;
}
exports.getModuleNameFromRequire = getModuleNameFromRequire;
function isCallToFQN(context, callExpression, moduleName, functionName) {
    const { callee } = callExpression;
    if (callee.type !== 'MemberExpression') {
        return false;
    }
    const module = getModuleNameOfNode(context, callee.object);
    return (module === null || module === void 0 ? void 0 : module.value) === moduleName && (0, ast_1.isIdentifier)(callee.property, functionName);
}
exports.isCallToFQN = isCallToFQN;
function getModuleAndCalledMethod(callee, context) {
    let module;
    let method;
    if (callee.type === 'MemberExpression' && callee.object.type === 'Identifier') {
        module = getModuleNameOfIdentifier(context, callee.object);
        method = callee.property;
    }
    if (callee.type === 'Identifier') {
        module = getModuleNameOfImportedIdentifier(context, callee);
        method = callee;
    }
    return { module, method };
}
exports.getModuleAndCalledMethod = getModuleAndCalledMethod;
/**
 * Checks that an ESLint member expression matches a fully qualified name
 *
 * A fully qualified name here denotes a value that is accessed through an imported
 * symbol, e.g., `foo.bar.baz` where `foo` was imported either from a require call
 * or an import statement:
 *
 * ```
 * const foo = require('lib');
 * foo.bar.baz.qux; // matches the fully qualified name ['lib', 'bar', 'baz', 'qux']
 * ```
 *
 * @param expr the member expression
 * @param qualifiers the qualifiers to match
 */
function hasFullyQualifiedName(context, expr, ...qualifiers) {
    (0, assert_1.default)(qualifiers.length >= 2, 'A fully qualified name should include two qualifiers at least.');
    let node = expr;
    while (node.type === 'MemberExpression') {
        const qualifier = qualifiers.pop();
        if (!qualifier || !(0, ast_1.isIdentifier)(node.property, qualifier)) {
            return false;
        }
        node = node.object;
    }
    if (node.type !== 'Identifier') {
        return false;
    }
    const module = getModuleNameOfImportedIdentifier(context, node);
    const qualifier = qualifiers.pop();
    if (!qualifier || (module === null || module === void 0 ? void 0 : module.value) !== qualifier) {
        return false;
    }
    return qualifiers.length === 0;
}
exports.hasFullyQualifiedName = hasFullyQualifiedName;
//# sourceMappingURL=module.js.map