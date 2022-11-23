"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
exports.rule = {
    create(context) {
        function checkNewExpression(node) {
            const newExpression = node;
            if (newExpression.callee.type === 'Identifier' && newExpression.callee.name === 'Array') {
                let message = 'Use either a literal or "Array.from()" instead of the "Array" constructor.';
                if (newExpression.arguments.length === 1 &&
                    newExpression.arguments[0].type === 'Literal' &&
                    typeof newExpression.arguments[0].value === 'number') {
                    message = 'Use "Array.from()" instead of the "Array" constructor.';
                }
                context.report({ node, message });
            }
        }
        return {
            NewExpression: checkNewExpression,
        };
    },
};
//# sourceMappingURL=array-constructor.js.map