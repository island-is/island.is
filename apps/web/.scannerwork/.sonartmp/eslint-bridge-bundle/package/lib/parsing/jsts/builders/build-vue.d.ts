import { SourceCode } from 'eslint';
import { JsTsAnalysisInput } from 'services/analysis';
/**
 * Builds an instance of ESLint SourceCode for Vue.js
 *
 * Building an ESLint SourceCode for Vue.js implies parsing the 'script' section of
 * a Vue.js Single Component (.vue) file. To this end, we use 'vue-eslint-parser',
 * which is instructed to parse that section either with TypeScript ESLint parser or
 * Babel parser. Furthermore, the Vue.js parser is also able to parse the 'template'
 * section of a .vue file.
 *
 * @param input the Vue.js JavaScript analysis input
 * @param tryTypeScriptESLintParser a flag for parsing with TypeScript ESLint parser
 * @returns the parsed Vue.js JavaScript code
 */
export declare function buildVue(input: JsTsAnalysisInput, tryTypeScriptESLintParser: boolean): SourceCode;
