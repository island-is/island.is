import { Rule } from 'eslint';
import * as estree from 'estree';
/**
 * This modules provides utilities for writing rules about Express.js.
 */
export declare namespace Express {
    /**
     * Checks whether the declaration looks somewhat like `<id> = express()`
     * and returns `<id>` if it matches.
     */
    function attemptFindAppInstantiation(varDecl: estree.VariableDeclarator, context: Rule.RuleContext): estree.Identifier | undefined;
    /**
     * Checks whether the function injects an instantiated app and is exported like `module.exports = function(app) {}`
     * or `module.exports.property = function(app) {}`, and returns app if it matches.
     */
    function attemptFindAppInjection(functionDef: estree.Function, context: Rule.RuleContext): estree.Identifier | undefined;
    /**
     * Checks whether the expression looks somewhat like `app.use(m1, [m2, m3], ..., mN)`,
     * where one of `mK`-nodes satisfies the given predicate.
     */
    function isUsingMiddleware(context: Rule.RuleContext, callExpression: estree.CallExpression, app: estree.Identifier, middlewareNodePredicate: (n: estree.Node) => boolean): boolean;
    /**
     * Checks whether a node looks somewhat like `require('m')()` for
     * some middleware `m` from the list of middlewares.
     */
    function isMiddlewareInstance(context: Rule.RuleContext, middlewares: string[], n: estree.Node): boolean;
    /**
     * Rule factory for detecting sensitive settings that are passed to
     * middlewares eventually used by Express.js applications:
     *
     * app.use(
     *   middleware(settings)
     * )
     *
     * or
     *
     * app.use(
     *   middleware.method(settings)
     * )
     *
     * @param sensitivePropertyFinder - a function looking for a sensitive setting on a middleware call
     * @param message - the reported message when an issue is raised
     * @returns a rule module that raises issues when a sensitive property is found
     */
    function SensitiveMiddlewarePropertyRule(sensitivePropertyFinder: (context: Rule.RuleContext, middlewareCall: estree.CallExpression) => estree.Property[], message: string): Rule.RuleModule;
}
