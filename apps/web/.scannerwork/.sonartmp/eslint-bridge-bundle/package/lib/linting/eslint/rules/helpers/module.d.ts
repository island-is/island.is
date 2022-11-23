import { Rule } from 'eslint';
import * as estree from 'estree';
/**
 * Returns the module name, when an identifier either represents a namespace for that module,
 * or is an alias for the default exported value.
 *
 * Returns undefined otherwise.
 * example: Given `import * as X from 'module_name'`, `getModuleNameOfIdentifier(X)`
 * returns `module_name`.
 */
export declare function getModuleNameOfIdentifier(context: Rule.RuleContext, identifier: estree.Identifier): estree.Literal | undefined;
/**
 * Returns the module name of either a directly `require`d or referenced module in
 * the following cases:
 *
 *  1. If `node` is a `require('m')` call;
 *  2. If `node` is an identifier `i` bound by an import, as in `import i from 'm'`;
 *  3. If `node` is an identifier `i`, and there is a single assignment with a `require`
 *     on the right hand side, i.e. `var i = require('m')`;
 *
 * then, in all three cases, the returned value will be the name of the module `'m'`.
 *
 * @param node the expression that is expected to evaluate to a module
 * @param context the rule context
 * @return literal with the name of the module or `undefined`.
 */
export declare function getModuleNameOfNode(context: Rule.RuleContext, node: estree.Node): estree.Literal | undefined;
/**
 * Returns the module name, when an identifier represents a binding imported from another module.
 * Returns undefined otherwise.
 * example: Given `import { f } from 'module_name'`, `getModuleNameOfImportedIdentifier(f)` returns `module_name`
 */
export declare function getModuleNameOfImportedIdentifier(context: Rule.RuleContext, identifier: estree.Identifier): estree.Literal | undefined;
export declare function getImportDeclarations(context: Rule.RuleContext): estree.ImportDeclaration[];
export declare function getRequireCalls(context: Rule.RuleContext): estree.CallExpression[];
export declare function getModuleNameFromRequire(node: estree.Node): estree.Literal | undefined;
export declare function isCallToFQN(context: Rule.RuleContext, callExpression: estree.CallExpression, moduleName: string, functionName: string): boolean;
export declare function getModuleAndCalledMethod(callee: estree.Node, context: Rule.RuleContext): {
    module: estree.Literal | undefined;
    method: estree.Expression | estree.PrivateIdentifier | undefined;
};
/**
 * Checks that an ESLint member expression matches a fully qualified name
 *
 * A fully qualified name here denotes a value that is accessed through an imported
 * symbol, e.g., `foo.bar.baz` where `foo` was imported either from a require call
 * or an import statement:
 *
 * ```
 * const foo = require('lib');
 * foo.bar.baz.qux; // matches the fully qualified name ['lib', 'bar', 'baz', 'qux']
 * ```
 *
 * @param expr the member expression
 * @param qualifiers the qualifiers to match
 */
export declare function hasFullyQualifiedName(context: Rule.RuleContext, expr: estree.MemberExpression, ...qualifiers: string[]): boolean;
