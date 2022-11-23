import { AST } from 'eslint';
import * as estree from 'estree';
import * as regexpp from 'regexpp';
/**
 * Returns the location of regexpNode relative to the node, which is regexp string or literal. If the computation
 * of location fails, it returns the range of the whole node.
 */
export declare function getRegexpRange(node: estree.Node, regexpNode: regexpp.AST.Node): AST.Range;
