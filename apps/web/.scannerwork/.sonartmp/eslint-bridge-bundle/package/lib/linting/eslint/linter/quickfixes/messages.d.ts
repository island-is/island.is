/**
 * Gets the quick fix message for a fixable ESLint rule
 *
 * A fixable ESLint rule here means an ESLint rule that provides
 * a fix that doesn't include a message contrary to suggestions.
 *
 * @param ruleKey the rule key of a fixable ESLint rule
 * @throws a runtime error if there are no corresponding messages
 * @returns the corresponding quick fix message
 */
export declare function getQuickFixMessage(ruleKey: string): string;
