import { SourceCode } from 'eslint';
import { AST } from 'vue-eslint-parser';
/**
 * Extracts comments and tokens from an ESLint source code
 *
 * The returned extracted comments includes also those from
 * the template section of a Vue.js Single File Component.
 *
 * @param sourceCode the source code to extract from
 * @returns the extracted tokens and comments
 */
export declare function extractTokensAndComments(sourceCode: SourceCode): {
    tokens: AST.Token[];
    comments: AST.Token[];
};
