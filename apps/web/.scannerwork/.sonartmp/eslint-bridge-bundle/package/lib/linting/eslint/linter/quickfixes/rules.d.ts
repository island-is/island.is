/**
 * The set of enabled rules with quick fixes
 *
 * The purpose of this set is to declare all the rules providing
 * ESLint fixes and suggestions that the linter should consider
 * during the transformation of an ESLint message into a SonarQube
 * issue, including quick fixes.
 *
 * This set needs to be updated whenever one wants to provide (or
 * filter out) the quick fix of a rule, be it an internal one or
 * an external one.
 */
export declare const quickFixRules: Set<string>;
