/**
 * Metrics of the source code
 *
 * @param ncloc the line numbers of physical code
 * @param commentLines the line numbers of comments
 * @param nosonarLines the line numbers of NOSONAR comments
 * @param executableLines the line numbers of executable code
 * @param functions the number of functions
 * @param statements the number of statements
 * @param classes the number of classes
 * @param complexity the cyclomatic complexity
 * @param cognitiveComplexity the cognitive complexity
 */
export interface Metrics {
    ncloc?: number[];
    commentLines?: number[];
    nosonarLines: number[];
    executableLines?: number[];
    functions?: number;
    statements?: number;
    classes?: number;
    complexity?: number;
    cognitiveComplexity?: number;
}
