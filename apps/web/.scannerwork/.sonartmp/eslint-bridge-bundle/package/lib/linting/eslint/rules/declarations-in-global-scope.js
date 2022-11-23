"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rule = void 0;
const helpers_1 = require("./helpers");
exports.rule = {
    meta: {
        messages: {
            defineLocally: 'Define this declaration in a local scope or bind explicitly the property to the global object.',
        },
    },
    create(context) {
        return {
            Program() {
                const scope = context.getScope();
                // As we parse every file with "module" source type, we find user defined global variables in the module scope
                const moduleScope = findModuleScope(context);
                moduleScope === null || moduleScope === void 0 ? void 0 : moduleScope.variables.forEach(variable => {
                    var _a;
                    if (scope.variables.find(global => global.name === variable.name)) {
                        // Avoid reporting on redefinitions of actual global variables
                        return;
                    }
                    for (const def of variable.defs) {
                        const defNode = def.node;
                        if (def.type === 'FunctionName' ||
                            (def.type === 'Variable' && ((_a = def.parent) === null || _a === void 0 ? void 0 : _a.kind) === 'var' && !isRequire(def.node.init))) {
                            context.report({
                                node: defNode,
                                messageId: 'defineLocally',
                            });
                            return;
                        }
                    }
                });
            },
        };
    },
};
function findModuleScope(context) {
    return context.getSourceCode().scopeManager.scopes.find(s => s.type === 'module');
}
function isRequire(node) {
    return ((node === null || node === void 0 ? void 0 : node.type) === 'CallExpression' &&
        node.arguments.length === 1 &&
        (0, helpers_1.isIdentifier)(node.callee, 'require'));
}
//# sourceMappingURL=declarations-in-global-scope.js.map