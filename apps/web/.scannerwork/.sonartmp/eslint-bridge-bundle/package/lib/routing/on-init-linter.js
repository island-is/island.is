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
const eslint_1 = require("linting/eslint");
/**
 * Handles initialization requests of the global ESLint linter wrappers
 *
 * The bridge relies on a global ESLint linter wrapper for JavaScript
 * and TypeScript analysis. Before any analysis, the linter wrapper
 * must be initialized explicitly, which includes the rules from the
 * active quality profile the linter must consider as well as global
 * variables ann JavaScript execution environments.
 */
function default_1(request, response) {
    const { rules, environments, globals, linterId } = request.body;
    (0, eslint_1.initializeLinter)(rules, environments, globals, linterId);
    response.send('OK!');
}
exports.default = default_1;
//# sourceMappingURL=on-init-linter.js.map