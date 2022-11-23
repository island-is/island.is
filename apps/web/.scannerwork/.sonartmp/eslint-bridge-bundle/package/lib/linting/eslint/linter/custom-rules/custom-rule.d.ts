import { Rule } from 'eslint';
/**
 * An ESLint-based custom rule
 *
 * @param ruleId the ESLint rule key
 * @param ruleModule the ESLint rule implementation
 * @param rule the ESLint rule configuration
 */
export interface CustomRule {
    ruleId: string;
    ruleModule: Rule.RuleModule;
    ruleConfig: any[];
}
