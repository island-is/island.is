import { Rule } from 'eslint';
/**
 * An internal rule parameter for context-passing support
 *
 * Rules implemented in the bridge all have access to the global
 * context since they share the same code base. However, external
 * rules like custom rules don't benefit from the same visibilty.
 *
 * To remedy this, rules that need to access the global context
 * for whatever reason can do so by first setting this parameter:
 *
 *
 * ```
 *  meta: {
 *    schema: [{
 *      title: 'sonar-context',
 *    }]
 *  }
 * ```
 *
 * The global context object can then be retrieved from the options
 * of ESLint's rule context, that is, `context.options`.
 */
export declare const SONAR_CONTEXT = "sonar-context";
/**
 * Checks if the rule schema sets the `sonar-context` internal parameter
 * @param ruleModule the rule definition
 * @param ruleId the ESLint rule key
 * @returns true if the rule definition includes the parameter
 */
export declare function hasSonarContextOption(ruleModule: Rule.RuleModule | undefined, ruleId: string): boolean;
