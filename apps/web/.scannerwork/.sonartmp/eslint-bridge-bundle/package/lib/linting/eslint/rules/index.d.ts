import { Rule } from 'eslint';
/**
 * The set of internal ESLint-based rules
 */
declare const rules: {
    [key: string]: Rule.RuleModule;
};
export { rules };
