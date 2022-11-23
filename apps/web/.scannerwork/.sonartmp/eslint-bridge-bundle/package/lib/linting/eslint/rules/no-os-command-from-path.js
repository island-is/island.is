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
// https://sonarsource.github.io/rspec/#/rspec/S4036/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const SENSITIVE_METHODS = ['exec', 'execSync', 'spawn', 'spawnSync', 'execFile', 'execFileSync'];
const REQUIRED_PATH_PREFIXES = ['./', '.\\', '../', '..\\', '/', '\\', 'C:\\'];
exports.rule = {
    meta: {
        messages: {
            issue: 'Make sure the "PATH" used to find this command includes only what you intend.',
        },
    },
    create(context) {
        return {
            CallExpression: (node) => {
                const { module, method } = (0, helpers_1.getModuleAndCalledMethod)(node.callee, context);
                if ((module === null || module === void 0 ? void 0 : module.value) === 'child_process' && (0, helpers_1.isIdentifier)(method, ...SENSITIVE_METHODS)) {
                    const sensitiveArg = findSensitiveArgument(context, node.arguments);
                    if (sensitiveArg !== null) {
                        context.report({
                            messageId: 'issue',
                            node: sensitiveArg,
                        });
                    }
                }
            },
        };
    },
};
function findSensitiveArgument(context, functionArgs) {
    if (functionArgs.length === 0) {
        return null;
    }
    const pathArg = functionArgs[0]; // we know this for the SENSITIVE_METHODS
    const literalInExpression = (0, helpers_1.getValueOfExpression)(context, pathArg, 'Literal');
    let stringLiteral;
    if (literalInExpression !== undefined && (0, helpers_1.isStringLiteral)(literalInExpression)) {
        stringLiteral = literalInExpression;
    }
    else {
        return null;
    }
    const startsWithRequiredPrefix = REQUIRED_PATH_PREFIXES.some(prefix => stringLiteral.value.startsWith(prefix));
    return startsWithRequiredPrefix ? null : pathArg;
}
//# sourceMappingURL=no-os-command-from-path.js.map