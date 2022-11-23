import { SourceCode } from 'eslint';
import { Metrics } from './metrics';
/**
 * Computes the metrics of an ESLint source code
 * @param sourceCode the ESLint source code
 * @param ignoreHeaderComments a flag to ignore file header comments
 * @param cognitiveComplexity the cognitive complexity of the source code
 * @returns the source code metrics
 */
export declare function computeMetrics(sourceCode: SourceCode, ignoreHeaderComments: boolean, cognitiveComplexity?: number): Metrics;
