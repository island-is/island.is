import { Rule } from 'eslint';
import { FileType } from 'helpers';
/**
 * An input rule configuration for linting
 *
 * @param key an ESLint rule key that maps a SonarQube rule identifier (SXXX) to the rule implementation
 * @param configurations an ESLint rule configuration provided from the anaylzer if the rule behaviour is customizable
 * @param fileTypeTarget a list of file type targets to filter issues in case the rule applies to main files, test files, or both
 *
 * The configuration of a rule is used to uniquely identify a rule, customize its behaviour,
 * and define what type(s) of file it should apply to during linting.
 *
 * An ESLint rule configuration can theoretically be a plain JavaScript object or a string. However, given the
 * nature of SonarQube' rule properties, it is currently used in the form of a string.
 */
export interface RuleConfig {
    key: string;
    configurations: any[];
    fileTypeTarget: FileType[];
}
/**
 * Extends an input rule configuration
 *
 * A rule configuration might be extended depending on the rule definition.
 * The purpose of the extension is to activate additional features during
 * linting, e.g., secondary locations.
 *
 * _A rule extension only applies to rules whose implementation is available._
 *
 * @param ruleModule the rule definition
 * @param inputRule the rule configuration
 * @returns the extended rule configuration
 */
export declare function extendRuleConfig(ruleModule: Rule.RuleModule | undefined, inputRule: RuleConfig): any[];
