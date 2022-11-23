import { SourceCode } from 'eslint';
/**
 * Finds the line numbers of code (ncloc)
 *
 * The line numbers of code denote physical lines that contain at least
 * one character which is neither a whitespace nor a tabulation nor part
 * of a comment.
 *
 * @param sourceCode the ESLint source code
 * @returns the line numbers of code
 */
export declare function findNcloc(sourceCode: SourceCode): number[];
