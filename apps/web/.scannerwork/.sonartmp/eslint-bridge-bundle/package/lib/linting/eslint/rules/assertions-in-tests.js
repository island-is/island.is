"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const eslint_1 = require("linting/eslint");
const helpers_1 = require("./helpers");
exports.rule = {
    create(context) {
        const testCases = [];
        return {
            'CallExpression:exit': (node) => {
                const testCase = helpers_1.Mocha.extractTestCase(node);
                if (testCase !== null) {
                    testCases.push(testCase);
                }
            },
            'Program:exit': () => {
                if (helpers_1.Chai.isImported(context)) {
                    testCases.forEach(testCase => checkAssertions(testCase, context));
                }
            },
        };
    },
};
function checkAssertions(testCase, context) {
    const { node, callback } = testCase;
    const visitor = new TestCaseAssertionVisitor(context);
    visitor.visit(callback.body);
    if (visitor.missingAssertions()) {
        context.report({ node, message: 'Add at least one assertion to this test case.' });
    }
}
class TestCaseAssertionVisitor {
    constructor(context) {
        this.context = context;
        this.visitorKeys = context.getSourceCode().visitorKeys;
        this.hasAssertions = false;
    }
    visit(node) {
        if (this.hasAssertions) {
            return;
        }
        if (helpers_1.Chai.isAssertion(node)) {
            this.hasAssertions = true;
            return;
        }
        if ((0, helpers_1.isFunctionCall)(node)) {
            const functionDef = (0, helpers_1.resolveFunction)(this.context, node.callee);
            if (functionDef) {
                this.visit(functionDef.body);
            }
        }
        for (const child of (0, eslint_1.childrenOf)(node, this.visitorKeys)) {
            this.visit(child);
        }
    }
    missingAssertions() {
        return !this.hasAssertions;
    }
}
//# sourceMappingURL=assertions-in-tests.js.map