"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chai = void 0;
const _1 = require(".");
var Chai;
(function (Chai) {
    function isImported(context) {
        return ((0, _1.getRequireCalls)(context).some(r => r.arguments[0].type === 'Literal' && r.arguments[0].value === 'chai') || (0, _1.getImportDeclarations)(context).some(i => i.source.value === 'chai'));
    }
    Chai.isImported = isImported;
    function isAssertion(node) {
        return isAssertUsage(node) || isExpectUsage(node) || isShouldUsage(node);
    }
    Chai.isAssertion = isAssertion;
    function isAssertUsage(node) {
        // assert(), assert.<expr>(), chai.assert(), chai.assert.<expr>()
        return (node.type === 'CallExpression' &&
            ((0, _1.isMethodInvocation)(node, 'chai', 'assert', 1) ||
                (0, _1.isFunctionInvocation)(node, 'assert', 1) ||
                ((0, _1.isMethodCall)(node) && (0, _1.isIdentifier)(node.callee.object, 'assert')) ||
                ((0, _1.isMethodCall)(node) &&
                    node.callee.object.type === 'MemberExpression' &&
                    (0, _1.isIdentifier)(node.callee.object.object, 'chai') &&
                    (0, _1.isIdentifier)(node.callee.object.property, 'assert'))));
    }
    function isExpectUsage(node) {
        // expect(), chai.expect()
        return (node.type === 'CallExpression' &&
            ((0, _1.isMethodInvocation)(node, 'chai', 'expect', 1) || (0, _1.isFunctionInvocation)(node, 'expect', 1)));
    }
    function isShouldUsage(node) {
        // <expr>.should.<expr>
        return node.type === 'MemberExpression' && (0, _1.isIdentifier)(node.property, 'should');
    }
})(Chai = exports.Chai || (exports.Chai = {}));
//# sourceMappingURL=chai.js.map