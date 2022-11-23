import { Linter, Rule, SourceCode } from 'eslint';
import { Issue } from './issue';
import { SymbolHighlight } from '../visitors';
/**
 * The result of linting a source code
 *
 * ESLint API returns what it calls messages as results of linting a file.
 * A linting result in the context of the analyzer includes more than that
 * as it needs not only to transform ESLint messages into SonarQube issues
 * as well as analysis data about the analyzed source code, namely symbol
 * highlighting and cognitive complexity.
 *
 * @param issues the issues found in the code
 * @param ucfgPaths list of paths of ucfg files written to disk
 * @param highlightedSymbols the symbol highlighting of the code
 * @param cognitiveComplexity the cognitive complexity of the code
 */
export declare type LintingResult = {
    issues: Issue[];
    ucfgPaths: string[];
    highlightedSymbols: SymbolHighlight[];
    cognitiveComplexity?: number;
};
/**
 * Transforms ESLint messages into SonarQube issues
 *
 * The result of linting a source code requires post-linting transformations
 * to return SonarQube issues. These transformations include extracting ucfg
 * paths, decoding issues with secondary locations as well as converting
 * quick fixes.
 *
 * Besides issues, a few metrics are computed during linting in the form of
 * an internal custom rule execution, namely cognitive complexity and symbol
 * highlighting. These custom rules also produce issues that are extracted.
 *
 * Transforming an ESLint message into a SonarQube issue implies:
 * - extracting UCFG rule file paths
 * - converting ESLint messages into SonarQube issues
 * - converting ESLint fixes into SonarLint quick fixes
 * - decoding encoded secondary locations
 * - normalizing issue locations
 *
 * @param messages ESLint messages to transform
 * @param ctx contextual information
 * @returns the linting result
 */
export declare function transformMessages(messages: Linter.LintMessage[], ctx: {
    sourceCode: SourceCode;
    rules: Map<string, Rule.RuleModule>;
}): LintingResult;
