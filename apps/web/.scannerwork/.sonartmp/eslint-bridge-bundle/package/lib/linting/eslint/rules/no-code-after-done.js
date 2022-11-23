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
// https://sonarsource.github.io/rspec/#/rspec/S6079/javascript
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
const parameters_1 = require("linting/eslint/linter/parameters");
exports.rule = {
    meta: {
        schema: [
            {
                // internal parameter for rules having secondary locations
                enum: [parameters_1.SONAR_RUNTIME],
            },
        ],
    },
    create(context) {
        let currentDoneVariable;
        let doneCall;
        let doneSegment;
        let currentSegment;
        let currentCase;
        const segmentFirstStatement = new Map();
        function checkForTestCase(node) {
            const testCase = helpers_1.Mocha.extractTestCase(node);
            if (!testCase) {
                return;
            }
            currentCase = testCase;
            currentDoneVariable = undefined;
            if (testCase.callback.params.length === 0) {
                return;
            }
            const [done] = testCase.callback.params;
            if (done.type !== 'Identifier') {
                return;
            }
            const callbackScope = context
                .getScope()
                .childScopes.find(scope => scope.block === testCase.callback);
            if (!callbackScope) {
                return;
            }
            currentDoneVariable = (0, helpers_1.getVariableFromIdentifier)(done, callbackScope);
        }
        function checkForDoneCall(node) {
            const { callee } = node;
            if (currentDoneVariable &&
                currentDoneVariable.references.some(ref => ref.identifier === callee)) {
                doneCall = node;
                doneSegment = currentSegment;
            }
        }
        function report(statementAfterDone) {
            context.report({
                node: statementAfterDone,
                message: (0, helpers_1.toEncodedMessage)(`Move this code before the call to "done".`, [
                    doneCall,
                ]),
            });
            doneSegment = undefined;
            doneCall = undefined;
            currentDoneVariable = undefined;
        }
        return {
            CallExpression: (node) => {
                checkForTestCase(node);
                checkForDoneCall(node);
            },
            ExpressionStatement: (node) => {
                if (currentSegment && currentSegment === doneSegment) {
                    report(node);
                }
                if (currentSegment && !segmentFirstStatement.has(currentSegment)) {
                    segmentFirstStatement.set(currentSegment, node);
                }
            },
            onCodePathSegmentStart(segment) {
                currentSegment = segment;
            },
            onCodePathEnd(_codePath, node) {
                currentSegment = undefined;
                if ((currentCase === null || currentCase === void 0 ? void 0 : currentCase.callback) === node && doneSegment) {
                    // we report an issue if one of 'doneSegment.nextSegments' is not empty
                    const statementAfterDone = doneSegment.nextSegments
                        .map(segment => segmentFirstStatement.get(segment))
                        .find(stmt => !!stmt);
                    if (statementAfterDone) {
                        report(statementAfterDone);
                    }
                }
            },
        };
    },
};
//# sourceMappingURL=no-code-after-done.js.map