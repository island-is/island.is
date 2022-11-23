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
exports.extendRuleConfig = void 0;
const helpers_1 = require("helpers");
const parameters_1 = require("../parameters");
/**
 * Extends an input rule configuration
 *
 * A rule configuration might be extended depending on the rule definition.
 * The purpose of the extension is to activate additional features during
 * linting, e.g., secondary locations.
 *
 * _A rule extension only applies to rules whose implementation is available._
 *
 * @param ruleModule the rule definition
 * @param inputRule the rule configuration
 * @returns the extended rule configuration
 */
function extendRuleConfig(ruleModule, inputRule) {
    const options = [...inputRule.configurations];
    if ((0, parameters_1.hasSonarRuntimeOption)(ruleModule, inputRule.key)) {
        options.push(parameters_1.SONAR_RUNTIME);
    }
    if ((0, parameters_1.hasSonarContextOption)(ruleModule, inputRule.key)) {
        options.push((0, helpers_1.getContext)());
    }
    return options;
}
exports.extendRuleConfig = extendRuleConfig;
//# sourceMappingURL=rule-config.js.map