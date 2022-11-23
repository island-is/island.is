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
// https://sonarsource.github.io/rspec/#/rspec/S5732/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const HELMET = 'helmet';
const HELMET_CSP = 'helmet-csp';
const DIRECTIVES = 'directives';
const NONE = "'none'";
const CONTENT_SECURITY_POLICY = 'contentSecurityPolicy';
const FRAME_ANCESTORS_CAMEL = 'frameAncestors';
const FRAME_ANCESTORS_HYPHEN = 'frame-ancestors';
exports.rule = helpers_1.Express.SensitiveMiddlewarePropertyRule(findDirectivesWithSensitiveFrameAncestorsPropertyFromHelmet, `Make sure disabling content security policy frame-ancestors directive is safe here.`);
function findDirectivesWithSensitiveFrameAncestorsPropertyFromHelmet(context, node) {
    const { arguments: args } = node;
    if (isValidHelmetModuleCall(context, node) && args.length === 1) {
        const [options] = args;
        const maybeDirectives = (0, helpers_1.getObjectExpressionProperty)(options, DIRECTIVES);
        if (maybeDirectives) {
            const maybeFrameAncestors = getFrameAncestorsProperty(maybeDirectives);
            if (!maybeFrameAncestors) {
                return [maybeDirectives];
            }
            if (isSetNoneFrameAncestorsProperty(maybeFrameAncestors)) {
                return [maybeFrameAncestors];
            }
        }
    }
    return [];
}
function isValidHelmetModuleCall(context, callExpr) {
    var _a, _b;
    const { callee } = callExpr;
    /* csp(options) */
    if (callee.type === 'Identifier' && ((_a = (0, helpers_1.getModuleNameOfNode)(context, callee)) === null || _a === void 0 ? void 0 : _a.value) === HELMET_CSP) {
        return true;
    }
    /* helmet.contentSecurityPolicy(options) */
    if (callee.type === 'MemberExpression' &&
        ((_b = (0, helpers_1.getModuleNameOfNode)(context, callee.object)) === null || _b === void 0 ? void 0 : _b.value) === HELMET &&
        callee.property.type === 'Identifier' &&
        callee.property.name === CONTENT_SECURITY_POLICY) {
        return true;
    }
    return false;
}
function isSetNoneFrameAncestorsProperty(frameAncestors) {
    const { value } = frameAncestors;
    return (value.type === 'ArrayExpression' &&
        Boolean(value.elements.find(v => (v === null || v === void 0 ? void 0 : v.type) === 'Literal' && typeof v.value === 'string' && v.value === NONE)));
}
function getFrameAncestorsProperty(directives) {
    const propertyKeys = [FRAME_ANCESTORS_CAMEL, FRAME_ANCESTORS_HYPHEN];
    for (const propertyKey of propertyKeys) {
        const maybeProperty = (0, helpers_1.getObjectExpressionProperty)(directives.value, propertyKey);
        if (maybeProperty) {
            return maybeProperty;
        }
    }
    return undefined;
}
//# sourceMappingURL=frame-ancestors.js.map