import { SourceCode } from 'eslint';
import { JsTsAnalysisInput } from 'services/analysis';
import { ParseFunction } from './eslint';
/**
 * Parses a JavaScript / TypeScript analysis input with an ESLint-based parser
 * @param input the JavaScript / TypeScript input to parse
 * @param parse the ESLint parsing function to use for parsing
 * @param options the ESLint parser options
 * @returns the parsed source code
 */
export declare function parseForESLint(input: JsTsAnalysisInput, parse: ParseFunction, options: {}): SourceCode;
