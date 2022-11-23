import { Rule } from 'eslint';
/**
 * Decorates external rules
 *
 * Decorating an external rule means customizing the original behaviour of the rule that
 * can't be done through rule configuration and requires special adjustments, among which
 * are internal decorators.
 *
 * @param externalRules the external rules to decorate
 */
export declare function decorateExternalRules(externalRules: {
    [name: string]: Rule.RuleModule;
}): void;
