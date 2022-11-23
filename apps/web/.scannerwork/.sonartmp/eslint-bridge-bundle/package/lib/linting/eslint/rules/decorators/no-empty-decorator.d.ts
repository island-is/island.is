import { Rule, AST } from 'eslint';
export declare function decorateNoEmpty(rule: Rule.RuleModule): Rule.RuleModule;
export declare function suggestEmptyBlockQuickFix(context: Rule.RuleContext, descriptor: Rule.ReportDescriptor, blockType: string, openingBrace: AST.Token, closingBrace: AST.Token): void;
