import { Rule } from 'eslint';
import { Issue } from './issue';
/**
 * Decodes an issue with secondary locations, if any
 *
 * Decoding an issue with secondary locations consists in checking
 * if the rule definition claims using secondary locations by the
 * definition of the `sonar-runtime` internal parameter. If it is
 * the case, secondary locations are then decoded and a well-formed
 * issue is then returned. Otherwise, the original issue is returned
 * unchanged.
 *
 * @param ruleModule the rule definition
 * @param issue the issue to decode
 * @throws a runtime error in case of an invalid encoding
 * @returns the decoded issue (or the original one)
 */
export declare function decodeSonarRuntime(ruleModule: Rule.RuleModule | undefined, issue: Issue): Issue;
