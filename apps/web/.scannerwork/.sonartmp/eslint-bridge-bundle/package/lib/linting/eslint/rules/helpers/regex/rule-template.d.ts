import { Rule } from 'eslint';
import * as estree from 'estree';
import * as regexpp from 'regexpp';
import type { RegExpVisitor } from 'regexpp/visitor';
/**
 * Rule context for regex rules that also includes the original ESLint node
 * denoting the regular expression (string) literal.
 */
export declare type RegexRuleContext = Rule.RuleContext & {
    node: estree.Node;
    reportRegExpNode: (descriptor: RegexReportDescriptor) => void;
};
declare type RegexReportMessage = {
    message: string;
} | {
    messageId: string;
};
declare type RegexReportData = {
    regexpNode: regexpp.AST.Node;
    node: estree.Node;
    offset?: [number, number];
};
declare type RegexReportDescriptor = RegexReportData & RegexReportMessage;
/**
 * Rule template to create regex rules.
 * @param handlers - the regexpp node handlers
 * @param meta - the (optional) rule metadata
 * @returns the resulting rule module
 */
export declare function createRegExpRule(handlers: (context: RegexRuleContext) => RegExpVisitor.Handlers, metadata?: {
    meta: Rule.RuleMetaData;
}): Rule.RuleModule;
export {};
