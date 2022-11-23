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
exports.transformFixes = void 0;
const messages_1 = require("./messages");
const rules_1 = require("./rules");
/**
 * Transforms ESLint fixes and suggestions into SonarLint quick fixes
 * @param source the source code
 * @param messages the ESLint messages to transform
 * @returns the transformed quick fixes
 */
function transformFixes(source, messages) {
    if (!hasQuickFix(messages)) {
        return [];
    }
    const quickFixes = [];
    if (messages.fix) {
        quickFixes.push({
            message: (0, messages_1.getQuickFixMessage)(messages.ruleId),
            edits: [fixToEdit(source, messages.fix)],
        });
    }
    if (messages.suggestions) {
        messages.suggestions.forEach(suggestion => {
            quickFixes.push({
                message: suggestion.desc,
                edits: [fixToEdit(source, suggestion.fix)],
            });
        });
    }
    return quickFixes;
}
exports.transformFixes = transformFixes;
/**
 * Checks if an ESLint fix is convertible into a SonarLint quick fix
 *
 * An ESLint fix is convertible into a SonarLint quick fix iff:
 * - it includes a fix or suggestions
 * - the quick fix of the rule is enabled
 *
 * @param message an ESLint message
 * @returns true if the message is convertible
 */
function hasQuickFix(message) {
    if (!message.fix && (!message.suggestions || message.suggestions.length === 0)) {
        return false;
    }
    return !!message.ruleId && rules_1.quickFixRules.has(message.ruleId);
}
/**
 * Transform an ESLint fix into a SonarLint quick fix edit
 * @param source the source code
 * @param fix the ESLint fix to transform
 * @returns the transformed SonarLint quick fix edit
 */
function fixToEdit(source, fix) {
    const [start, end] = fix.range;
    const startPos = source.getLocFromIndex(start);
    const endPos = source.getLocFromIndex(end);
    return {
        loc: {
            line: startPos.line,
            column: startPos.column,
            endLine: endPos.line,
            endColumn: endPos.column,
        },
        text: fix.text,
    };
}
//# sourceMappingURL=transform.js.map