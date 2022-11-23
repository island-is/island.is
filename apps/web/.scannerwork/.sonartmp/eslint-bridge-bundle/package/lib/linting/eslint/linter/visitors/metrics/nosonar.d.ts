import { SourceCode } from 'eslint';
/**
 * Finds the line numbers of `NOSONAR` comments
 *
 * `NOSONAR` comments are indicators for SonarQube to ignore
 * any issues raised on the same lines as those where appear
 * such comments.
 *
 * @param sourceCode the source code to visit
 * @returns the line numbers of `NOSONAR` comments
 */
export declare function findNoSonarLines(sourceCode: SourceCode): {
    nosonarLines: number[];
};
