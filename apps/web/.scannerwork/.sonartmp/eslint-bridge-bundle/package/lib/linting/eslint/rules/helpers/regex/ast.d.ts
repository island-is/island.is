import { ParserServices } from '@typescript-eslint/experimental-utils';
import * as estree from 'estree';
export declare function isRegExpConstructor(node: estree.Node): node is estree.CallExpression;
export declare function isStringReplaceCall(call: estree.CallExpression, services: ParserServices): boolean;
export declare function isStringRegexMethodCall(call: estree.CallExpression, services: ParserServices): boolean;
