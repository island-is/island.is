import * as estree from 'estree';
import { Rule } from 'eslint';
export declare function removeNodeWithLeadingWhitespaces(context: Rule.RuleContext, node: estree.Node, fixer: Rule.RuleFixer, removeUntil?: number): Rule.Fix;
