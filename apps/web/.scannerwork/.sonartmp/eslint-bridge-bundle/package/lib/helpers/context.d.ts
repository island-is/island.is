/**
 * A container of contextual information
 *
 * @param workDir the working directory of the analyzed project
 * @param shouldUseTypeScriptParserForJS a flag for parsing JavaScript code with TypeScript ESLint parser
 * @param sonarlint a flag for indicating whether the bridge is used in SonarLint context
 * @param bundles a set of rule bundles to load
 */
export interface Context {
    workDir: string;
    shouldUseTypeScriptParserForJS: boolean;
    sonarlint: boolean;
    bundles: string[];
}
/**
 * Returns the global context
 * @returns the global context
 */
export declare function getContext(): Context;
/**
 * Sets the global context
 * @param ctx the new global context
 */
export declare function setContext(ctx: Context): void;
