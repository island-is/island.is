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
exports.convertMessage = void 0;
const quickfixes_1 = require("../quickfixes");
/**
 * Converts an ESLint message into a SonarQube issue
 *
 * Converting an ESLint message into a SonarQube issue consists in extracting
 * the relevant properties from the message for the most of it. Furthermore,
 * it transforms ESLint fixes into SonarLint quick fixes, if any. On the other
 * hand, encoded secondary locations remain in the issue message at this stage
 * and are decoded in a subsequent step.
 *
 * @param source the source code
 * @param message the ESLint message to convert
 * @returns the converted SonarQube issue
 */
function convertMessage(source, message) {
    /**
     * The property `ruleId` equals `null` on parsing errors, but it should not
     * happen because we lint ready SourceCode instances and not file contents.
     */
    if (!message.ruleId) {
        console.error("Illegal 'null' ruleId for eslint issue");
        return null;
    }
    return {
        ruleId: message.ruleId,
        line: message.line,
        column: message.column,
        endLine: message.endLine,
        endColumn: message.endColumn,
        message: message.message,
        quickFixes: (0, quickfixes_1.transformFixes)(source, message),
        secondaryLocations: [],
    };
}
exports.convertMessage = convertMessage;
//# sourceMappingURL=message.js.map