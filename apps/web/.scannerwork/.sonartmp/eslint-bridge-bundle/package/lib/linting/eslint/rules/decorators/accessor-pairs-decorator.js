"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateAccessorPairs = void 0;
const helpers_1 = require("./helpers");
function decorateAccessorPairs(rule) {
    return (0, helpers_1.interceptReport)(rule, reportExempting(isDecoratedSetterWithAngularInput));
}
exports.decorateAccessorPairs = decorateAccessorPairs;
function reportExempting(exemptionCondition) {
    return (context, reportDescriptor) => {
        if ('node' in reportDescriptor) {
            const def = reportDescriptor['node'];
            if (!exemptionCondition(def)) {
                context.report(reportDescriptor);
            }
        }
    };
}
function isDecoratedSetterWithAngularInput(def) {
    const { kind, decorators } = def;
    return (kind === 'set' &&
        decorators !== undefined &&
        decorators.some(decorator => decorator.expression.type === 'CallExpression' &&
            decorator.expression.callee.type === 'Identifier' &&
            decorator.expression.callee.name === 'Input'));
}
//# sourceMappingURL=accessor-pairs-decorator.js.map