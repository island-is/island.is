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
exports.rule = void 0;
const eslint_plugin_sonarjs_1 = require("eslint-plugin-sonarjs");
/**
 * The internal _cognitive complexity_ custom rule
 *
 * The rule computes file-level cognitive complexity.
 */
exports.rule = {
    ruleId: 'internal-cognitive-complexity',
    ruleModule: eslint_plugin_sonarjs_1.rules['cognitive-complexity'],
    ruleConfig: ['metric'],
};
//# sourceMappingURL=cognitive-complexity.js.map