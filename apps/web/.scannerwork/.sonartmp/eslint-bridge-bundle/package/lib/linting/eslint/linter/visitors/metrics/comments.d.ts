import { SourceCode } from 'eslint';
/**
 * Finds the line numbers of comments in the source code
 * @param sourceCode the source code to visit
 * @param ignoreHeaderComments a flag to ignore file header comments
 * @returns the line numbers of comments
 */
export declare function findCommentLines(sourceCode: SourceCode, ignoreHeaderComments: boolean): {
    commentLines: number[];
    nosonarLines: number[];
};
