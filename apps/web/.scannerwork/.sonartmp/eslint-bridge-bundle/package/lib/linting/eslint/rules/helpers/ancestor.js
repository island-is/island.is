"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeParent = exports.getParent = exports.ancestorsChain = exports.localAncestorsChain = exports.findFirstMatchingAncestor = exports.findFirstMatchingLocalAncestor = void 0;
const ast_1 = require("./ast");
function findFirstMatchingLocalAncestor(node, predicate) {
    return localAncestorsChain(node).find(predicate);
}
exports.findFirstMatchingLocalAncestor = findFirstMatchingLocalAncestor;
function findFirstMatchingAncestor(node, predicate) {
    return ancestorsChain(node, new Set()).find(predicate);
}
exports.findFirstMatchingAncestor = findFirstMatchingAncestor;
function localAncestorsChain(node) {
    return ancestorsChain(node, ast_1.functionLike);
}
exports.localAncestorsChain = localAncestorsChain;
function ancestorsChain(node, boundaryTypes) {
    const chain = [];
    let currentNode = node.parent;
    while (currentNode) {
        chain.push(currentNode);
        if (boundaryTypes.has(currentNode.type)) {
            break;
        }
        currentNode = currentNode.parent;
    }
    return chain;
}
exports.ancestorsChain = ancestorsChain;
function getParent(context) {
    const ancestors = context.getAncestors();
    return ancestors.length > 0 ? ancestors[ancestors.length - 1] : undefined;
}
exports.getParent = getParent;
/**
 * Returns the parent of an ESLint node
 *
 * This function assumes that an ESLint node exposes a parent property,
 * which is always defined. However, it's better to use `getParent` if
 * it is possible to retrieve the parent based on the rule context.
 *
 * It should eventually disappear once we come up with a proper solution
 * against the conflicting typings between ESLint and TypeScript ESLint
 * when it comes to the parent of a node.
 *
 * @param node an ESLint node
 * @returns the parent node
 */
function getNodeParent(node) {
    return node.parent;
}
exports.getNodeParent = getNodeParent;
//# sourceMappingURL=ancestor.js.map