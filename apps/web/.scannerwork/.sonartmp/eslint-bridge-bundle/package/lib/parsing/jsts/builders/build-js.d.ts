import { SourceCode } from 'eslint';
import { JsTsAnalysisInput } from 'services/analysis';
/**
 * Builds an instance of ESLint SourceCode for JavaScript
 *
 * Building an ESLint SourceCode for JavaScript implies parsing JavaScript code with
 * ESLint-based parsers. For the particular case of JavaScript code, we first try to
 * parse the code with TypeScript ESLint parser. If the input includes TSConfigs, the
 * resulting ESLint SourceCode would include a reference to TypeScript's type checker
 * in its parser services, if configured properly. Rules implemented internally could
 * then benefit from type information. If parsing fails at this point, we fallback to
 * Babel's parser and make two other attempts to parse the code by considering the two
 * possible source types: 'module' vs. 'script'.
 *
 * @param input the JavaScript analysis input
 * @param tryTypeScriptESLintParser a flag for parsing with TypeScript ESLint parser
 * @returns the parsed JavaScript code
 */
export declare function buildJs(input: JsTsAnalysisInput, tryTypeScriptESLintParser: boolean): SourceCode;
