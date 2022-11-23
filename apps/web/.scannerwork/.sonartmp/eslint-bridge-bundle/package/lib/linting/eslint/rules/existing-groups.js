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
// https://sonarsource.github.io/rspec/#/rspec/S6328/javascript
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const regexpp = __importStar(require("regexpp"));
const helpers_1 = require("./helpers");
const regex_1 = require("./helpers/regex");
exports.rule = {
    meta: {
        messages: {
            nonExistingGroup: 'Referencing non-existing group{{groups}}.',
        },
    },
    create(context) {
        const services = context.parserServices;
        if (!(0, helpers_1.isRequiredParserServices)(services)) {
            return {};
        }
        return {
            CallExpression: (call) => {
                if ((0, regex_1.isStringReplaceCall)(call, services)) {
                    const [pattern, substr] = call.arguments;
                    const regex = (0, regex_1.getParsedRegex)(pattern, context);
                    if (regex !== null) {
                        const groups = extractGroups(regex);
                        const references = (0, regex_1.extractReferences)(substr);
                        const invalidReferences = references.filter(ref => !isReferencingExistingGroup(ref, groups));
                        if (invalidReferences.length > 0) {
                            const groups = `${invalidReferences.length > 1 ? 's' : ''}: ${invalidReferences
                                .map(ref => ref.raw)
                                .join(', ')}`;
                            context.report({
                                node: substr,
                                messageId: 'nonExistingGroup',
                                data: {
                                    groups,
                                },
                            });
                        }
                    }
                }
            },
        };
    },
};
class CapturingGroups {
    constructor() {
        this.names = new Set();
        this.groups = 0;
    }
    add(name) {
        if (name !== null) {
            this.names.add(name);
        }
        this.groups++;
    }
    has(name) {
        return this.names.has(name);
    }
    count() {
        return this.groups;
    }
}
function extractGroups(regex) {
    const groups = new CapturingGroups();
    regexpp.visitRegExpAST(regex, {
        onCapturingGroupEnter: group => groups.add(group.name),
    });
    return groups;
}
function isReferencingExistingGroup(reference, groups) {
    if (!isNaN(Number(reference.value))) {
        const index = Number(reference.value);
        return index >= 1 && index <= groups.count();
    }
    else {
        const name = reference.value;
        return groups.has(name);
    }
}
//# sourceMappingURL=existing-groups.js.map