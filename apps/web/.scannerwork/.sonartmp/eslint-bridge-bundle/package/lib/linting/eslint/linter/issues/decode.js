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
exports.decodeSonarRuntime = void 0;
const parameters_1 = require("../parameters");
/**
 * Decodes an issue with secondary locations, if any
 *
 * Decoding an issue with secondary locations consists in checking
 * if the rule definition claims using secondary locations by the
 * definition of the `sonar-runtime` internal parameter. If it is
 * the case, secondary locations are then decoded and a well-formed
 * issue is then returned. Otherwise, the original issue is returned
 * unchanged.
 *
 * @param ruleModule the rule definition
 * @param issue the issue to decode
 * @throws a runtime error in case of an invalid encoding
 * @returns the decoded issue (or the original one)
 */
function decodeSonarRuntime(ruleModule, issue) {
    if ((0, parameters_1.hasSonarRuntimeOption)(ruleModule, issue.ruleId)) {
        try {
            const encodedMessage = JSON.parse(issue.message);
            return { ...issue, ...encodedMessage };
        }
        catch (e) {
            throw new Error(`Failed to parse encoded issue message for rule ${issue.ruleId}:\n"${issue.message}". ${e.message}`);
        }
    }
    return issue;
}
exports.decodeSonarRuntime = decodeSonarRuntime;
//# sourceMappingURL=decode.js.map