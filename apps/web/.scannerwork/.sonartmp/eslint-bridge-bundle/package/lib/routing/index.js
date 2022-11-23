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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const on_analyze_css_1 = __importDefault(require("./on-analyze-css"));
const on_analyze_js_1 = __importDefault(require("./on-analyze-js"));
const on_analyze_ts_1 = __importDefault(require("./on-analyze-ts"));
const on_analyze_yaml_1 = __importDefault(require("./on-analyze-yaml"));
const on_create_program_1 = __importDefault(require("./on-create-program"));
const on_delete_program_1 = __importDefault(require("./on-delete-program"));
const on_init_linter_1 = __importDefault(require("./on-init-linter"));
const on_new_tsconfig_1 = __importDefault(require("./on-new-tsconfig"));
const on_status_1 = __importDefault(require("./on-status"));
const on_tsconfig_files_1 = __importDefault(require("./on-tsconfig-files"));
const router = express_1.default.Router();
router.post('/analyze-css', on_analyze_css_1.default);
router.post('/analyze-js', on_analyze_js_1.default);
router.post('/analyze-ts', on_analyze_ts_1.default);
router.post('/analyze-with-program', on_analyze_ts_1.default);
router.post('/analyze-yaml', on_analyze_yaml_1.default);
router.post('/create-program', on_create_program_1.default);
router.post('/delete-program', on_delete_program_1.default);
router.post('/init-linter', on_init_linter_1.default);
router.post('/new-tsconfig', on_new_tsconfig_1.default);
router.get('/status', on_status_1.default);
router.post('/tsconfig-files', on_tsconfig_files_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map