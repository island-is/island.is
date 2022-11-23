import { LinterWrapper, RuleConfig } from './linter';
export * from './linter';
export * from './rules';
declare type Linters = {
    [id: string]: LinterWrapper;
};
/**
 * Initializes the global linter wrapper
 * @param inputRules the rules from the active quality profiles
 * @param environments the JavaScript execution environments
 * @param globals the global variables
 * @param linterId key of the linter
 */
export declare function initializeLinter(inputRules: RuleConfig[], environments?: string[], globals?: string[], linterId?: string): void;
/**
 * Returns the linter with the given ID
 *
 * @param linterId key of the linter
 *
 * Throws a runtime error if the global linter wrapper is not initialized.
 */
export declare function getLinter(linterId?: keyof Linters): LinterWrapper;
