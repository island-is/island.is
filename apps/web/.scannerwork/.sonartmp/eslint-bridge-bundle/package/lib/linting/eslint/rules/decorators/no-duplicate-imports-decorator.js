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
// https://sonarsource.github.io/rspec/#/rspec/S3863/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateNoDuplicateImports = void 0;
const helpers_1 = require("./helpers");
const helpers_2 = require("linting/eslint/rules/helpers");
// core implementation of this rule does not provide quick fixes
function decorateNoDuplicateImports(rule) {
    rule.meta.hasSuggestions = true;
    return (0, helpers_1.interceptReport)(rule, (context, reportDescriptor) => {
        const duplicateDecl = reportDescriptor.node;
        context.report({
            ...reportDescriptor,
            suggest: getSuggestion(duplicateDecl, context),
        });
    });
}
exports.decorateNoDuplicateImports = decorateNoDuplicateImports;
function getSuggestion(duplicateDecl, context) {
    const module = getModule(duplicateDecl);
    const importDecl = getFirstMatchingImportDeclaration(module, context);
    if (!importDecl) {
        return [];
    }
    const newSpecifiersText = mergeSpecifiers(importDecl, duplicateDecl, context);
    const oldSpecifiersRange = getSpecifiersRange(importDecl, context);
    return [
        {
            desc: `Merge this import into the first import from "${module}"`,
            fix: fixer => [
                fixer.replaceTextRange(oldSpecifiersRange, newSpecifiersText),
                (0, helpers_2.removeNodeWithLeadingWhitespaces)(context, duplicateDecl, fixer),
            ],
        },
    ];
}
function mergeSpecifiers(toDecl, fromDecl, context) {
    const specifiers = [...toDecl.specifiers, ...fromDecl.specifiers];
    if (specifiers.length === 0) {
        return '';
    }
    let defaultSpecifierText = '';
    let namespaceSpecifierText = '';
    const importSpecifiersTexts = [];
    for (const specifier of specifiers) {
        const specifierText = context.getSourceCode().getText(specifier);
        switch (specifier.type) {
            case 'ImportDefaultSpecifier':
                defaultSpecifierText = specifierText;
                break;
            case 'ImportNamespaceSpecifier':
                namespaceSpecifierText = specifierText;
                break;
            case 'ImportSpecifier':
                importSpecifiersTexts.push(specifierText);
                break;
        }
    }
    let importSpecifiersText = '';
    if (importSpecifiersTexts.length > 0) {
        const multiline = isMultiline(toDecl) || isMultiline(fromDecl);
        const [separator, prefix, suffix] = multiline ? [',\n', '{\n', '\n}'] : [', ', '{ ', ' }'];
        importSpecifiersText = importSpecifiersTexts
            .map(text => (multiline ? '  ' + text : text))
            .join(separator);
        importSpecifiersText = `${prefix}${importSpecifiersText}${suffix}`;
    }
    return [defaultSpecifierText, namespaceSpecifierText, importSpecifiersText]
        .filter(text => text.length > 0)
        .join(', ');
}
function getSpecifiersRange(decl, context) {
    const sourceCode = context.getSourceCode();
    const importDecl = decl;
    const importOrType = importDecl.importKind === 'type' ? 'type' : 'import';
    const importOrTypeToken = sourceCode.getFirstToken(decl, token => token.value === importOrType);
    const fromToken = sourceCode.getLastToken(decl, token => token.value === 'from');
    const begin = importOrTypeToken.range[1] + 1;
    const end = fromToken ? fromToken.range[0] - 1 : importOrTypeToken.range[1] + 1;
    return [begin, end];
}
function isMultiline(node) {
    return node.loc.start.line !== node.loc.end.line;
}
function getModule(decl) {
    return decl.source.value.trim();
}
function getFirstMatchingImportDeclaration(module, context) {
    return context
        .getSourceCode()
        .ast.body.find(node => node.type === 'ImportDeclaration' && module === getModule(node));
}
//# sourceMappingURL=no-duplicate-imports-decorator.js.map