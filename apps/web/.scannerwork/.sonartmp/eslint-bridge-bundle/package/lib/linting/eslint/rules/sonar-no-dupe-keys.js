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
// https://sonarsource.github.io/rspec/#/rspec/S1534/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const eslint_1 = require("eslint");
const eslint_plugin_react_1 = require("eslint-plugin-react");
const helpers_1 = require("./decorators/helpers");
const rules = new eslint_1.Linter().getRules();
const noDupeKeysRule = rules.get('no-dupe-keys');
const jsxNoDuplicatePropsRule = eslint_plugin_react_1.rules['jsx-no-duplicate-props'];
exports.rule = {
    // meta of no-dupe-keys and jsx-no-duplicate-props is required for issue messages
    meta: {
        messages: { ...noDupeKeysRule.meta.messages, ...jsxNoDuplicatePropsRule.meta.messages },
    },
    create(context) {
        const noDupeKeysListener = noDupeKeysRule.create(context);
        const jsxNoDuplicatePropsListener = jsxNoDuplicatePropsRule.create(context);
        return (0, helpers_1.mergeRules)(noDupeKeysListener, jsxNoDuplicatePropsListener);
    },
};
//# sourceMappingURL=sonar-no-dupe-keys.js.map