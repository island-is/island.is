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
exports.hasSonarContextOption = exports.SONAR_CONTEXT = void 0;
const schema_1 = require("./helpers/schema");
/**
 * An internal rule parameter for context-passing support
 *
 * Rules implemented in the bridge all have access to the global
 * context since they share the same code base. However, external
 * rules like custom rules don't benefit from the same visibilty.
 *
 * To remedy this, rules that need to access the global context
 * for whatever reason can do so by first setting this parameter:
 *
 *
 * ```
 *  meta: {
 *    schema: [{
 *      title: 'sonar-context',
 *    }]
 *  }
 * ```
 *
 * The global context object can then be retrieved from the options
 * of ESLint's rule context, that is, `context.options`.
 */
exports.SONAR_CONTEXT = 'sonar-context';
/**
 * Checks if the rule schema sets the `sonar-context` internal parameter
 * @param ruleModule the rule definition
 * @param ruleId the ESLint rule key
 * @returns true if the rule definition includes the parameter
 */
function hasSonarContextOption(ruleModule, ruleId) {
    const schema = (0, schema_1.getRuleSchema)(ruleModule, ruleId);
    return !!schema && schema.some(option => option.title === exports.SONAR_CONTEXT);
}
exports.hasSonarContextOption = hasSonarContextOption;
//# sourceMappingURL=sonar-context.js.map