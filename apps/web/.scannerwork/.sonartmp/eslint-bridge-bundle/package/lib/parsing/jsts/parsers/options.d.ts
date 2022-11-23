import { Linter } from 'eslint';
import { JsTsAnalysisInput } from 'services/analysis';
/**
 * Builds ESLint parser options
 *
 * ESLint parser options allows for customizing the behaviour of
 * the ESLint-based parser used to parse JavaScript or TypeScript
 * code. It configures the ECMAscript version, specific syntax or
 * features to consider as valid during parsing, and additional
 * contents in the abstract syntax tree, among other things.
 *
 * @param input the analysis input to parse
 * @param usingBabel a flag to indicate if we intend to parse with Babel
 * @param parser a parser dependency to use
 * @param sourceType the type of the source code
 * @returns the parser options for the input
 */
export declare function buildParserOptions(input: JsTsAnalysisInput, usingBabel?: boolean, parser?: string, sourceType?: 'script' | 'module'): Linter.ParserOptions;
