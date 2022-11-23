import { TSESTree } from '@typescript-eslint/experimental-utils';
import { Rule } from 'eslint';
import { Node } from 'estree';
export declare function findFirstMatchingLocalAncestor(node: TSESTree.Node, predicate: (node: TSESTree.Node) => boolean): TSESTree.Node | undefined;
export declare function findFirstMatchingAncestor(node: TSESTree.Node, predicate: (node: TSESTree.Node) => boolean): TSESTree.Node | undefined;
export declare function localAncestorsChain(node: TSESTree.Node): TSESTree.Node[];
export declare function ancestorsChain(node: TSESTree.Node, boundaryTypes: Set<string>): TSESTree.Node[];
export declare function getParent(context: Rule.RuleContext): import("estree").Property | import("estree").CatchClause | import("estree").ClassDeclaration | import("estree").ClassExpression | import("estree").ClassBody | import("estree").Identifier | import("estree").SimpleLiteral | import("estree").RegExpLiteral | import("estree").BigIntLiteral | import("estree").ArrayExpression | import("estree").ArrowFunctionExpression | import("estree").AssignmentExpression | import("estree").AwaitExpression | import("estree").BinaryExpression | import("estree").SimpleCallExpression | import("estree").NewExpression | import("estree").ChainExpression | import("estree").ConditionalExpression | import("estree").FunctionExpression | import("estree").ImportExpression | import("estree").LogicalExpression | import("estree").MemberExpression | import("estree").MetaProperty | import("estree").ObjectExpression | import("estree").SequenceExpression | import("estree").TaggedTemplateExpression | import("estree").TemplateLiteral | import("estree").ThisExpression | import("estree").UnaryExpression | import("estree").UpdateExpression | import("estree").YieldExpression | import("estree").FunctionDeclaration | import("estree").MethodDefinition | import("estree").ImportDeclaration | import("estree").ExportNamedDeclaration | import("estree").ExportDefaultDeclaration | import("estree").ExportAllDeclaration | import("estree").ImportSpecifier | import("estree").ImportDefaultSpecifier | import("estree").ImportNamespaceSpecifier | import("estree").ExportSpecifier | import("estree").ObjectPattern | import("estree").ArrayPattern | import("estree").RestElement | import("estree").AssignmentPattern | import("estree").PrivateIdentifier | import("estree").Program | import("estree").PropertyDefinition | import("estree").SpreadElement | import("estree").ExpressionStatement | import("estree").BlockStatement | import("estree").StaticBlock | import("estree").EmptyStatement | import("estree").DebuggerStatement | import("estree").WithStatement | import("estree").ReturnStatement | import("estree").LabeledStatement | import("estree").BreakStatement | import("estree").ContinueStatement | import("estree").IfStatement | import("estree").SwitchStatement | import("estree").ThrowStatement | import("estree").TryStatement | import("estree").WhileStatement | import("estree").DoWhileStatement | import("estree").ForStatement | import("estree").ForInStatement | import("estree").ForOfStatement | import("estree").VariableDeclaration | import("estree").Super | import("estree").SwitchCase | import("estree").TemplateElement | import("estree").VariableDeclarator | undefined;
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
export declare function getNodeParent(node: Node): Node;
