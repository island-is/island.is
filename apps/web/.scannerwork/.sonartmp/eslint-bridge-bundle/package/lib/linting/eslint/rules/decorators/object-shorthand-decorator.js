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
// https://sonarsource.github.io/rspec/#/rspec/S3498/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateObjectShorthand = void 0;
const helpers_1 = require("./helpers");
// core implementation of this rule raises issues on aura lightning components
function decorateObjectShorthand(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(isAuraLightningComponent));
}
exports.decorateObjectShorthand = decorateObjectShorthand;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const property = reportDescriptor['node'];
            if (!exemptionCondition(property)) {
                context.report({ ...reportDescriptor, node: property.key });
            }
        }
    };
}
function isAuraLightningComponent(property) {
    const { parent, value } = property;
    return (parent.parent.type === 'ExpressionStatement' &&
        parent.parent.parent.type === 'Program' &&
        value.type === 'FunctionExpression');
}
//# sourceMappingURL=object-shorthand-decorator.js.map