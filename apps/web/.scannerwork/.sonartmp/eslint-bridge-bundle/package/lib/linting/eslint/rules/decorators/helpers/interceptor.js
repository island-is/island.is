"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.interceptReport = void 0;
const NUM_ARGS_NODE_MESSAGE = 2;
/**
 * Modifies the behavior of `context.report(descriptor)` for a given rule.
 *
 * Useful for performing additional checks before reporting an issue.
 *
 * @param rule the original rule
 * @param onReport replacement for `context.report(descr)`
 *                 invocations used inside of the rule
 */
function interceptReport(rule, onReport) {
    return {
        // meta should be defined only when it's defined on original rule, otherwise RuleTester will fail
        ...(!!rule.meta && { meta: rule.meta }),
        create(originalContext) {
            const interceptingContext = {
                id: originalContext.id,
                options: originalContext.options,
                settings: originalContext.settings,
                parserPath: originalContext.parserPath,
                parserOptions: originalContext.parserOptions,
                parserServices: originalContext.parserServices,
                getCwd() {
                    return originalContext.getCwd();
                },
                getPhysicalFilename() {
                    return originalContext.getPhysicalFilename();
                },
                getAncestors() {
                    return originalContext.getAncestors();
                },
                getDeclaredVariables(node) {
                    return originalContext.getDeclaredVariables(node);
                },
                getFilename() {
                    return originalContext.getFilename();
                },
                getScope() {
                    return originalContext.getScope();
                },
                getSourceCode() {
                    return originalContext.getSourceCode();
                },
                markVariableAsUsed(name) {
                    return originalContext.markVariableAsUsed(name);
                },
                report(...args) {
                    let descr = undefined;
                    if (args.length === 1) {
                        descr = args[0];
                    }
                    else if (args.length === NUM_ARGS_NODE_MESSAGE && typeof args[1] === 'string') {
                        // not declared in the `.d.ts`, but used in practice by rules written in JS
                        descr = {
                            node: args[0],
                            message: args[1],
                        };
                    }
                    if (descr) {
                        onReport(originalContext, descr);
                    }
                },
            };
            return rule.create(interceptingContext);
        },
    };
}
exports.interceptReport = interceptReport;
//# sourceMappingURL=interceptor.js.map