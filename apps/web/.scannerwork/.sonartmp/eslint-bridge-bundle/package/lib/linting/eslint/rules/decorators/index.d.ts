import { decorateAccessorPairs } from './accessor-pairs-decorator';
/**
 * The set of internal ESLint rule decorators
 *
 * The purpose of these decorators is to refine the behaviour of
 * external ESLint rules. These refinements can include reducing
 * the noise by adding exceptions, extending the scope of a rule,
 * adding the support of quick fixes, etc.
 *
 * Once declared here, these decorators are automatically applied
 * to the corresponding rule definitions by the linter's wrapper.
 * There is no further setup required to enable them, except when
 * one needs to test them using ESLint's rule tester.
 */
export declare const decorators: {
    decorate: typeof decorateAccessorPairs;
    ruleKey: string;
}[];
