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
exports.measureDuration = void 0;
const process_1 = require("process");
/**
 * Mesures the running time of a function
 * @param f a function to run
 * @returns the returned value of the function and its running time
 */
function measureDuration(f) {
    const start = process_1.hrtime.bigint();
    const result = f();
    const duration = Math.round(Number(process_1.hrtime.bigint() - start) / 1000);
    return { result, duration };
}
exports.measureDuration = measureDuration;
//# sourceMappingURL=measure.js.map