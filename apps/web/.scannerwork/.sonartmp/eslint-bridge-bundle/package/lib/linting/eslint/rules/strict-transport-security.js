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
// https://sonarsource.github.io/rspec/#/rspec/S5734/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const HSTS = 'hsts';
const HELMET = 'helmet';
const MAX_AGE = 'maxAge';
const INCLUDE_SUB_DOMAINS = 'includeSubDomains';
const RECOMMENDED_MAX_AGE = 15552000;
exports.rule = helpers_1.Express.SensitiveMiddlewarePropertyRule(findSensitiveTransportSecurityPolicyProperty, `Disabling Strict-Transport-Security policy is security-sensitive.`);
function findSensitiveTransportSecurityPolicyProperty(context, node) {
    const sensitiveFinders = [findSensitiveHsts, findSensitiveMaxAge, findSensitiveIncludeSubDomains];
    const sensitives = [];
    const { callee, arguments: args } = node;
    if (args.length === 1 && args[0].type === 'ObjectExpression') {
        const [options] = args;
        for (const finder of sensitiveFinders) {
            const maybeSensitive = finder(context, callee, options);
            if (maybeSensitive) {
                sensitives.push(maybeSensitive);
            }
        }
    }
    return sensitives;
}
function findSensitiveHsts(context, middleware, options) {
    if (isModuleNode(context, middleware, HELMET)) {
        return (0, helpers_1.getPropertyWithValue)(context, options, HSTS, false);
    }
    return undefined;
}
function findSensitiveMaxAge(context, middleware, options) {
    if (isHstsMiddlewareNode(context, middleware)) {
        const maybeMaxAgeProperty = (0, helpers_1.getObjectExpressionProperty)(options, MAX_AGE);
        if (maybeMaxAgeProperty) {
            const maybeMaxAgeValue = (0, helpers_1.getValueOfExpression)(context, maybeMaxAgeProperty.value, 'Literal');
            if (typeof (maybeMaxAgeValue === null || maybeMaxAgeValue === void 0 ? void 0 : maybeMaxAgeValue.value) === 'number' &&
                maybeMaxAgeValue.value < RECOMMENDED_MAX_AGE) {
                return maybeMaxAgeProperty;
            }
        }
    }
    return undefined;
}
function findSensitiveIncludeSubDomains(context, middleware, options) {
    if (isHstsMiddlewareNode(context, middleware)) {
        return (0, helpers_1.getPropertyWithValue)(context, options, INCLUDE_SUB_DOMAINS, false);
    }
    return undefined;
}
function isHstsMiddlewareNode(context, node) {
    return (isModuleNode(context, node, HSTS) ||
        (node.type === 'MemberExpression' &&
            isModuleNode(context, node.object, HELMET) &&
            node.property.type === 'Identifier' &&
            node.property.name === HSTS));
}
function isModuleNode(context, node, moduleName) {
    var _a;
    return node.type === 'Identifier' && ((_a = (0, helpers_1.getModuleNameOfNode)(context, node)) === null || _a === void 0 ? void 0 : _a.value) === moduleName;
}
//# sourceMappingURL=strict-transport-security.js.map