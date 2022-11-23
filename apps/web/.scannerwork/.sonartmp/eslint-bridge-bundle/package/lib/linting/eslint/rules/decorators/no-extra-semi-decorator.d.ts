import { Rule } from 'eslint';
import * as estree from 'estree';
export declare function decorateNoExtraSemi(rule: Rule.RuleModule): Rule.RuleModule;
export declare function isProtectionSemicolon(context: Rule.RuleContext, node: estree.Node): boolean;
