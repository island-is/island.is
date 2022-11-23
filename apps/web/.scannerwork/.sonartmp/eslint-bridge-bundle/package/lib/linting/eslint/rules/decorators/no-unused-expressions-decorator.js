"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateNoUnusedExpressions = void 0;
const helpers_1 = require("./helpers");
function decorateNoUnusedExpressions(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(expr => isNegatedIife(expr) ||
        containsChaiExpect(expr) ||
        containsValidChaiShould(expr) ||
        isAuraLightningComponent(expr) ||
        isSequenceWithSideEffects(expr)));
}
exports.decorateNoUnusedExpressions = decorateNoUnusedExpressions;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const n = reportDescriptor['node'];
            const expr = n.expression;
            if (!exemptionCondition(expr)) {
                context.report(reportDescriptor);
            }
        }
    };
}
function containsChaiExpect(node) {
    if (node.type === 'CallExpression') {
        if (node.callee.type === 'Identifier' && node.callee.name === 'expect') {
            return true;
        }
        else {
            return containsChaiExpect(node.callee);
        }
    }
    else if (node.type === 'MemberExpression') {
        return containsChaiExpect(node.object);
    }
    return false;
}
function containsValidChaiShould(node, isSubexpr = false) {
    if (node.type === 'CallExpression') {
        return containsValidChaiShould(node.callee, true);
    }
    else if (node.type === 'MemberExpression') {
        if (node.property && node.property.type === 'Identifier' && node.property.name === 'should') {
            // Expressions like `x.should` are valid only as subexpressions, not on top level
            return isSubexpr;
        }
        else {
            return containsValidChaiShould(node.object, true);
        }
    }
    return false;
}
function isNegatedIife(node) {
    return node.type === 'UnaryExpression' && node.operator === '!' && isIife(node.argument);
}
function isIife(node) {
    return (node.type === 'CallExpression' &&
        (node.callee.type === 'FunctionExpression' || node.callee.type === 'ArrowFunctionExpression'));
}
function isSequenceWithSideEffects(node) {
    return (node.type === 'SequenceExpression' &&
        node.expressions[node.expressions.length - 1].type === 'AssignmentExpression');
}
function isAuraLightningComponent(node) {
    var _a, _b;
    return (node.type === 'ObjectExpression' &&
        node.properties.length > 0 &&
        ((_b = (_a = node.parent) === null || _a === void 0 ? void 0 : _a.parent) === null || _b === void 0 ? void 0 : _b.type) === 'Program');
}
//# sourceMappingURL=no-unused-expressions-decorator.js.map