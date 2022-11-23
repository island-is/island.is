import { Linter, Rule, SourceCode } from 'eslint';
import { CustomRule } from './custom-rules';
import { RuleConfig } from './config';
import { FileType } from 'helpers';
import { LintingResult } from './issues';
/**
 * A wrapper of ESLint linter
 *
 * The purpose of the wrapper is to configure the behaviour of ESLint linter,
 * which includes:
 *
 * - defining the rules that should be used during linting,
 * - declaring globals that need to be considered as such
 * - defining the environments bringing a set of predefined variables
 *
 * Because some rules target main files while other target test files (or even
 * both), the wrapper relies on two linting configurations to decide which set
 * of rules should be considered during linting.
 *
 * Last but not least, the linter wrapper eventually turns ESLint problems,
 * also known as messages, into SonarQube issues.
 */
export declare class LinterWrapper {
    /** The wrapper's internal ESLint linter instance */
    readonly linter: Linter;
    /** The wrapper's linting configuration */
    readonly config: {
        [key in FileType]: Linter.Config;
    };
    /** The wrapper's rule database */
    readonly rules: Map<string, Rule.RuleModule>;
    /**
     * Constructs an ESLint linter wrapper
     *
     * Constructing an linter wrapper consists in building the rule database
     * the internal ESLint linter shall consider during linting. Furthermore,
     * it creates a linting configuration that configures which rules should
     * be used on linting based on the active quality profile and file type.
     *
     * @param inputRules the quality profile rules
     * @param customRules the additional custom rules
     * @param environments the JavaScript environments
     * @param globals the global variables
     */
    constructor(inputRules: RuleConfig[], customRules?: CustomRule[], environments?: string[], globals?: string[]);
    /**
     * Lints an ESLint source code instance
     *
     * Linting a source code implies using ESLint linting functionality to find
     * problems in the code. It selects which linting configuration needs to be
     * considered during linting based on the file type.
     *
     * @param sourceCode the ESLint source code
     * @param filePath the path of the source file
     * @param fileType the type of the source file
     * @returns the linting result
     */
    lint(sourceCode: SourceCode, filePath: string, fileType?: FileType): LintingResult;
    /**
     * Defines the wrapper's rule database
     *
     * The wrapper's rule database is mainly built upon the set of homemade
     * rules implemented internally in the bridge as well as the ESLint core
     * rules from the ESLint linter. Some other rules from selected ESLint
     * plugins extend the rule database as well as (internal) custom rules.
     * These external rules might even be decorated by internal decorators
     * in order to refine their behaviour.
     *
     * @param customRules a set of custom rules to add
     * @returns a complete database of ESLint-based rules
     */
    private defineRules;
    /**
     * Gets the external ESLint-based rules
     *
     * The external ESLint-based rules includes all the rules that are
     * not implemented internally, in other words, rules from external
     * dependencies which includes ESLint core rules. Furthermore, the
     * returned rules are decorated either by internal decorators or by
     * special decorations.
     *
     * @returns the ESLint-based external rules
     */
    private getExternalRules;
    /**
     * Creates the wrapper's linting configuration
     *
     * The wrapper's linting configuration actually includes two
     * ESLint configurations: one per file type.
     *
     * @param inputRules the rules from the active quality profile
     * @param linterRules the rules defined in the linter
     * @param environments the JavaScript environments
     * @param globals the global variables
     * @returns the wrapper's linting configuration
     */
    private createConfig;
}
