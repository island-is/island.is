"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = exports.messages = void 0;
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
// https://sonarsource.github.io/rspec/#/rspec/S5362/css
const stylelint = __importStar(require("stylelint"));
const postcss_value_parser_1 = __importDefault(require("postcss-value-parser"));
const ruleName = 'function-calc-no-invalid';
const operators = ['+', '-', '*', '/'];
// exported for testing purpose
exports.messages = {
    empty: "Fix this empty 'calc' expression.",
    malformed: "Fix this malformed 'calc' expression.",
    divByZero: "Fix this 'calc' expression with division by zero.",
};
const ruleImpl = () => {
    return (root, result) => {
        root.walkDecls((decl) => {
            (0, postcss_value_parser_1.default)(decl.value).walk(node => {
                if (!isCalcFunction(node)) {
                    return;
                }
                const calc = node;
                checkDivisionByZero(calc.nodes);
                checkMissingOperator(calc.nodes);
                checkEmpty(calc.nodes);
            });
            function isCalcFunction(node) {
                return node.type === 'function' && node.value.toLowerCase() === 'calc';
            }
            function isParenthesizedExpression(node) {
                return node.type === 'function' && node.value.toLowerCase() !== 'calc';
            }
            function checkDivisionByZero(nodes) {
                const siblings = nodes.filter(node => !isSpaceOrComment(node));
                for (const [index, node] of siblings.entries()) {
                    if (isDivision(node)) {
                        const operand = siblings[index + 1];
                        if (operand && isZero(operand)) {
                            report(exports.messages.divByZero);
                        }
                    }
                    else if (isParenthesizedExpression(node)) {
                        // parenthesized expressions are represented as `function` nodes
                        // they need to be visited as well if they are not `calc` calls
                        checkDivisionByZero(node.nodes);
                    }
                }
            }
            function checkMissingOperator(nodes) {
                const siblings = nodes.filter(node => !isSpaceOrComment(node));
                for (let index = 1; index < siblings.length; index += 2) {
                    const node = siblings[index];
                    if (!isOperator(node)) {
                        report(exports.messages.malformed);
                    }
                }
                for (const node of siblings) {
                    if (isParenthesizedExpression(node)) {
                        // parenthesized expressions are represented as `function` nodes
                        // they need to be visited as well if they are not `calc` calls
                        checkMissingOperator(node.nodes);
                    }
                }
            }
            function checkEmpty(nodes) {
                if (nodes.filter(node => !isSpaceOrComment(node)).length === 0) {
                    report(exports.messages.empty);
                }
            }
            function isSpaceOrComment(node) {
                return node.type === 'space' || node.type === 'comment';
            }
            function isOperator(node) {
                return (node.type === 'word' && operators.includes(node.value)) || node.type === 'div';
            }
            function isDivision(node) {
                return (node.type === 'word' || node.type === 'div') && node.value === '/';
            }
            function isZero(node) {
                return node.type === 'word' && parseFloat(node.value) === 0;
            }
            function report(message) {
                stylelint.utils.report({
                    ruleName,
                    result,
                    message,
                    node: decl,
                });
            }
        });
    };
};
exports.rule = stylelint.createPlugin(ruleName, Object.assign(ruleImpl, {
    messages: exports.messages,
    ruleName,
}));
//# sourceMappingURL=function-calc-no-invalid.js.map