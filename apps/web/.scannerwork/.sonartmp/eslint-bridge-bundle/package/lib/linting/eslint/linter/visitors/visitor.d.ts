import * as estree from 'estree';
import { SourceCode } from 'eslint';
/**
 * Visits the abstract syntax tree of an ESLint source code
 * @param sourceCode the source code to visit
 * @param callback a callback function invoked at each node visit
 */
export declare function visit(sourceCode: SourceCode, callback: (node: estree.Node) => void): void;
/**
 * Returns the direct children of a node
 * @param node the node to get the children
 * @param visitorKeys the visitor keys provided by the source code
 * @returns the node children
 */
export declare function childrenOf(node: estree.Node, visitorKeys: SourceCode.VisitorKeys): estree.Node[];
