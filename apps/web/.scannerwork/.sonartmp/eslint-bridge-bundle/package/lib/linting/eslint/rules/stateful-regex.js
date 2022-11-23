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
// https://sonarsource.github.io/rspec/#/rspec/S6351/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const regex_1 = require("./helpers/regex");
const parameters_1 = require("linting/eslint/linter/parameters");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
    create(context) {
        const invocations = new Map();
        const regexes = [];
        const resets = new Set();
        return {
            'Literal:exit': (node) => {
                extractRegex(node, regexes);
            },
            'CallExpression:exit': (node) => {
                const callExpr = node;
                extractRegex(node, regexes);
                extractRegexInvocation(callExpr, regexes, invocations, context);
                checkWhileConditionRegex(callExpr, context);
            },
            'MemberExpression:exit': (node) => {
                extractResetRegex(node, regexes, resets, context);
            },
            'NewExpression:exit': (node) => {
                extractRegex(node, regexes);
            },
            'Program:exit': () => {
                regexes.forEach(regex => checkGlobalStickyRegex(regex, context));
                invocations.forEach((usages, regex) => checkMultipleInputsRegex(regex, usages, resets, context));
            },
        };
    },
};
function extractRegex(node, acc) {
    if ((0, helpers_1.isRegexLiteral)(node)) {
        const { flags } = node.regex;
        acc.push({ node, flags });
    }
    else if ((0, regex_1.isRegExpConstructor)(node)) {
        const flags = (0, regex_1.getFlags)(node) || '';
        acc.push({ node, flags });
    }
}
function extractRegexInvocation(callExpr, regexes, invocations, context) {
    if ((0, helpers_1.isCallingMethod)(callExpr, 1, 'exec', 'test') &&
        callExpr.callee.object.type === 'Identifier') {
        const { object } = callExpr.callee;
        const variable = (0, helpers_1.getVariableFromName)(context, object.name);
        if (variable) {
            const value = (0, helpers_1.getUniqueWriteUsage)(context, variable.name);
            const regex = regexes.find(r => r.node === value);
            if (regex && regex.flags.includes('g')) {
                const usages = invocations.get(variable);
                if (usages) {
                    usages.push(callExpr);
                }
                else {
                    invocations.set(variable, [callExpr]);
                }
            }
        }
    }
}
function extractResetRegex(node, regexes, resets, context) {
    /* RegExp.prototype.lastIndex = ... */
    if ((0, helpers_1.isDotNotation)(node) &&
        node.object.type === 'Identifier' &&
        node.property.name === 'lastIndex') {
        const parent = (0, helpers_1.getParent)(context);
        if ((parent === null || parent === void 0 ? void 0 : parent.type) === 'AssignmentExpression' && parent.left === node) {
            const variable = (0, helpers_1.getVariableFromName)(context, node.object.name);
            if (variable) {
                const value = (0, helpers_1.getUniqueWriteUsage)(context, variable.name);
                const regex = regexes.find(r => r.node === value);
                if (regex) {
                    resets.add(variable);
                }
            }
        }
    }
}
function checkWhileConditionRegex(callExpr, context) {
    /* RegExp.prototype.exec() within while conditions */
    if ((0, helpers_1.isMethodCall)(callExpr)) {
        const { object, property } = callExpr.callee;
        if (((0, helpers_1.isRegexLiteral)(object) || (0, regex_1.isRegExpConstructor)(object)) && property.name === 'exec') {
            const flags = object.type === 'Literal' ? object.regex.flags : (0, regex_1.getFlags)(object);
            if (flags && flags.includes('g') && isWithinWhileCondition(callExpr, context)) {
                context.report({
                    message: (0, helpers_1.toEncodedMessage)('Extract this regular expression to avoid infinite loop.', []),
                    node: object,
                });
            }
        }
    }
}
function checkGlobalStickyRegex(regex, context) {
    /* RegExp with `g` and `y` flags */
    if (regex.flags.includes('g') && regex.flags.includes('y')) {
        context.report({
            message: (0, helpers_1.toEncodedMessage)(`Remove the 'g' flag from this regex as it is shadowed by the 'y' flag.`, []),
            node: regex.node,
        });
    }
}
function checkMultipleInputsRegex(regex, usages, resets, context) {
    /* RegExp.prototype.exec(input) / RegExp.prototype.test(input) */
    if (!resets.has(regex)) {
        const definition = regex.defs.find(def => def.type === 'Variable' && def.node.init);
        const uniqueInputs = new Set(usages.map(callExpr => context.getSourceCode().getText(callExpr.arguments[0])));
        const regexReset = uniqueInputs.has(`''`) || uniqueInputs.has(`""`);
        if (definition && uniqueInputs.size > 1 && !regexReset) {
            const pattern = definition.node.init;
            context.report({
                message: (0, helpers_1.toEncodedMessage)(`Remove the 'g' flag from this regex as it is used on different inputs.`, usages, usages.map((_, idx) => `Usage ${idx + 1}`)),
                node: pattern,
            });
        }
    }
}
function isWithinWhileCondition(node, context) {
    const ancestors = context.getAncestors();
    let parent;
    let child = node;
    while ((parent = ancestors.pop()) !== undefined) {
        if (helpers_1.functionLike.has(parent.type)) {
            break;
        }
        if (parent.type === 'WhileStatement' || parent.type === 'DoWhileStatement') {
            return parent.test === child;
        }
        child = parent;
    }
    return false;
}
//# sourceMappingURL=stateful-regex.js.map