import { JsTsAnalysisInput } from 'services/analysis';
/**
 * Builds an instance of ESLint SourceCode for TypeScript
 *
 * Building an ESLint SourceCode for TypeScript implies parsing TypeScript code with
 * TypeScript ESLint parser. However, if the source code denotes TypeScript code in
 * Vue.js Single File Components, Vue.js ESLint parser is used instead to parse the
 * whole file. Furthermore, it is configured to use TypeScript ESLint parser to parse
 * the contents of the 'script' section of the component.
 *
 * @param input the TypeScript analysis input
 * @param isVueFile a flag to indicate if the input denotes Vue.js TypeScript code
 * @returns the parsed TypeScript code
 */
export declare function buildTs(input: JsTsAnalysisInput, isVueFile: boolean): import("eslint").SourceCode;
