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
// https://sonarsource.github.io/rspec/#/rspec/S3533/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            standardImport: 'Use a standard "import" statement instead of "{{adhocImport}}".',
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            'CallExpression[callee.type="Identifier"]': (node) => {
                if (context.getScope().type !== 'module' && context.getScope().type !== 'global') {
                    return;
                }
                const callExpression = node;
                const identifier = callExpression.callee;
                if (isAmdImport(callExpression, identifier, services) ||
                    isCommonJsImport(callExpression, identifier, services)) {
                    context.report({
                        node: identifier,
                        messageId: 'standardImport',
                        data: {
                            adhocImport: identifier.name,
                        },
                    });
                }
            },
        };
    },
};
function isCommonJsImport(callExpression, identifier, services) {
    return (callExpression.arguments.length === 1 &&
        (0, helpers_1.isString)(callExpression.arguments[0], services) &&
        identifier.name === 'require');
}
function isAmdImport(callExpression, identifier, services) {
    if (identifier.name !== 'require' && identifier.name !== 'define') {
        return false;
    }
    if (callExpression.arguments.length !== 2 && callExpression.arguments.length !== 3) {
        return false;
    }
    return (0, helpers_1.isFunction)(callExpression.arguments[callExpression.arguments.length - 1], services);
}
//# sourceMappingURL=no-require-or-define.js.map