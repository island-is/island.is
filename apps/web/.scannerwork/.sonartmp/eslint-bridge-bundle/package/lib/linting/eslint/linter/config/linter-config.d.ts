import { Linter, Rule } from 'eslint';
import { RuleConfig } from './rule-config';
/**
 * Creates an ESLint linting configuration
 *
 * A linter configuration is created based on the input rules enabled by
 * the user through the active quality profile and the rules provided by
 * the linter wrapper.
 *
 * The configuration includes the rules with their configuration that are
 * used during linting as well as the global variables and the JavaScript
 * execution environments defined through the analyzer's properties.
 *
 * @param inputRules the rules from the active quality profile
 * @param linterRules the wrapper's rule database
 * @param environments the JavaScript execution environments
 * @param globs the global variables
 * @returns the created ESLint linting configuration
 */
export declare function createLinterConfig(inputRules: RuleConfig[], linterRules: Map<string, Rule.RuleModule>, environments: string[], globs: string[]): Linter.Config<Linter.RulesRecord>;
