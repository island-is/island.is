import { AST, Rule } from 'eslint';
import * as estree from 'estree';
import * as regexpp from 'regexpp';
/**
 * Gets the regexp node location in the ESLint referential
 * @param node the ESLint regex node
 * @param regexpNode the regexp regex node
 * @param context the rule context
 * @param offset an offset to apply on the location
 * @returns the regexp node location in the ESLint referential
 */
export declare function getRegexpLocation(node: estree.Node, regexpNode: regexpp.AST.Node, context: Rule.RuleContext, offset?: number[]): AST.SourceLocation;
