/**
 * An ESLint-based parsing function
 *
 * ESLint-based parsing functions takes as inputs a code to parse
 * as well as options to configure the parser and returns either
 * an instance of ESLint SourceCode or a parsing error.
 */
export declare type ParseFunction = (code: string, options: {}) => any;
/**
 * An ESLint-based parser container
 *
 * The purpose of this type is to group together an ESLint parser
 * dependency along with its parsing function. When building the
 * parsing options of a parser, it happens sometime that we need
 * the parser dependency rather than the actual parsing function,
 * and vice versa.
 *
 * @param parser the parser dependency
 * @param parse the parsing function
 */
export declare type ESLintParser = {
    parser: string;
    parse: ParseFunction;
};
/**
 * The ESLint-based parsers used to parse JavaScript, TypeScript, and Vue.js code.
 */
export declare const parsers: {
    javascript: ESLintParser;
    typescript: ESLintParser;
    vuejs: ESLintParser;
};
/**
 * Clears TypeScript ESLint parser's caches
 *
 * While analyzing multiple files that used TypeScript ESLint parser to
 * parse their respective code, raised issues may differ depending on
 * clearing or not TypeScript ESLint parser's caches. To address that,
 * the sensor requests clearing the caches for each considered TSConfig.
 */
export declare function clearTypeScriptESLintParserCaches(): void;
