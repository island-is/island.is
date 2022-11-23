import * as estree from 'estree';
import * as regexpp from 'regexpp';
import { Rule } from 'eslint';
export declare function getParsedRegex(node: estree.Node, context: Rule.RuleContext): regexpp.AST.RegExpLiteral | null;
