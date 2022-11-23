import stylelint from 'stylelint';
/**
 * A Stylelint rule configuration
 *
 * @param key the Stylelint rule key
 * @param configuration the rule specific configuration
 */
export interface RuleConfig {
    key: string;
    configurations: any[];
}
/**
 * Creates a Stylelint configuration
 *
 * Creating a Stylelint configuration implies enabling along with specific rule
 * configuration all the rules from the active quality profile.
 *
 * @param rules the rules from the active quality profile
 * @returns the created Stylelint configuration
 */
export declare function createStylelintConfig(rules: RuleConfig[]): stylelint.Config;
