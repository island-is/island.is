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
exports.decorateExternalRules = void 0;
const eslint_1 = require("eslint");
const eslint_plugin_1 = require("@typescript-eslint/eslint-plugin");
const decorators_1 = require("linting/eslint/rules/decorators");
const sanitize_1 = require("./sanitize");
/**
 * Decorates external rules
 *
 * Decorating an external rule means customizing the original behaviour of the rule that
 * can't be done through rule configuration and requires special adjustments, among which
 * are internal decorators.
 *
 * @param externalRules the external rules to decorate
 */
function decorateExternalRules(externalRules) {
    const eslintRules = new eslint_1.Linter().getRules();
    /**
     * S1537 ('comma-dangle'), S3723 ('enforce-trailing-comma')
     *
     * S1537 and S3723 both depend on the same ESLint implementation but the
     * plugin doesn't allow duplicates of the same rule key.
     */
    const commaDangleRuleId = 'comma-dangle';
    const enforceTrailingCommaRuleId = 'enforce-trailing-comma';
    externalRules[enforceTrailingCommaRuleId] = eslintRules.get(commaDangleRuleId);
    /**
     * S3696 ('no-throw-literal')
     *
     * TypeScript ESLint implementation of no-throw-literal does not support JavaScript code.
     */
    const noThrowLiteralRuleId = 'no-throw-literal';
    delete eslint_plugin_1.rules[noThrowLiteralRuleId];
    externalRules[noThrowLiteralRuleId] = eslintRules.get(noThrowLiteralRuleId);
    /**
     * TypeScript ESLint rules sanitization
     *
     * TypeScript ESLint rules that rely on type information fail at runtime because
     * they unconditionally assume that TypeScript's type checker is available.
     */
    for (const ruleKey of Object.keys(eslint_plugin_1.rules)) {
        externalRules[ruleKey] = (0, sanitize_1.sanitizeTypeScriptESLintRule)(externalRules[ruleKey]);
    }
    /**
     * Decorate (TypeScript-) ESLint external rules
     *
     * External rules are decorated with internal decorators to refine their
     * behaviour: exceptions, quick fixes, secondary locations, etc.
     */
    for (const { ruleKey, decorate } of decorators_1.decorators) {
        externalRules[ruleKey] = decorate(externalRules[ruleKey]);
    }
}
exports.decorateExternalRules = decorateExternalRules;
//# sourceMappingURL=decorate.js.map