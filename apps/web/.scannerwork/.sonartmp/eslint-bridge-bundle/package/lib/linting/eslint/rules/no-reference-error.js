"use strict";
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
        const excludedNames = new Set();
        const undeclaredIdentifiersByName = new Map();
        return {
            'Program:exit'() {
                excludedNames.clear();
                undeclaredIdentifiersByName.clear();
                const globalScope = context.getScope();
                globalScope.through.forEach(ref => {
                    const identifier = ref.identifier;
                    if (excludedNames.has(identifier.name)) {
                        return;
                    }
                    if (ref.writeExpr ||
                        hasTypeOfOperator(identifier) ||
                        isWithinWithStatement(identifier)) {
                        excludedNames.add(identifier.name);
                        return;
                    }
                    const undeclaredIndentifiers = undeclaredIdentifiersByName.get(identifier.name);
                    if (!!undeclaredIndentifiers) {
                        undeclaredIndentifiers.push(identifier);
                    }
                    else {
                        undeclaredIdentifiersByName.set(identifier.name, [identifier]);
                    }
                });
                undeclaredIdentifiersByName.forEach((identifiers, name) => {
                    context.report({
                        node: identifiers[0],
                        message: (0, helpers_1.toEncodedMessage)(`\"${name}\" does not exist. Change its name or declare it so that its usage doesn't result in a \"ReferenceError\".`, identifiers.slice(1)),
                    });
                });
            },
        };
    },
};
function isWithinWithStatement(node) {
    return !!(0, helpers_1.findFirstMatchingAncestor)(node, ancestor => ancestor.type === 'WithStatement');
}
function hasTypeOfOperator(node) {
    const parent = node.parent;
    return (parent === null || parent === void 0 ? void 0 : parent.type) === 'UnaryExpression' && parent.operator === 'typeof';
}
//# sourceMappingURL=no-reference-error.js.map