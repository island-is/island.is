import { Rule } from 'eslint';
/**
 * Sanitizes a TypeScript ESLint rule
 *
 * TypeScript ESLint rules that relies on TypeScript's type system unconditionally assumes
 * that the type checker is always available. Linting a source code with such rules could
 * lead to a runtime error if that assumption turned out to be wrong for whatever reason.
 *
 * Aa TypeScript ESLint rule needs, therefore, to be sanitized in case its implementation
 * relies on type checking. The metadata of such a rule sets the `requiresTypeChecking`
 * property to `true`.
 *
 * The sanitization of a rule is nothing more than a decoration of its implementation. It
 * determining whether the rule uses type checking and checks whether type information is
 * available at runtime. If so, the execution of the rule proceeds; otherwise, it stops.
 *
 * @param rule a TypeScript ESLint rule to sanitize
 * @returns the sanitized rule
 */
export declare function sanitizeTypeScriptESLintRule(rule: Rule.RuleModule): Rule.RuleModule;
