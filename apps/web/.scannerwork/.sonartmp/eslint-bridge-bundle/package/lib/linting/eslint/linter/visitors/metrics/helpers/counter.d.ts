import * as estree from 'estree';
import { SourceCode } from 'eslint';
/**
 * Counts the number of nodes matching a predicate
 * @param sourceCode the source code to vist
 * @param predicate the condition to count the node
 * @returns the number of nodes matching the predicate
 */
export declare function visitAndCountIf(sourceCode: SourceCode, predicate: (node: estree.Node) => boolean): number;
