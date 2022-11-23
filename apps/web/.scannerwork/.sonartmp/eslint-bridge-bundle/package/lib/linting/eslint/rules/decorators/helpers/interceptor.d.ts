import { Rule } from 'eslint';
/**
 * Modifies the behavior of `context.report(descriptor)` for a given rule.
 *
 * Useful for performing additional checks before reporting an issue.
 *
 * @param rule the original rule
 * @param onReport replacement for `context.report(descr)`
 *                 invocations used inside of the rule
 */
export declare function interceptReport(rule: Rule.RuleModule, onReport: (context: Rule.RuleContext, reportDescriptor: Rule.ReportDescriptor) => void): Rule.RuleModule;
