import * as estree from 'estree';
/**
 * A metric location
 *
 * @param startLine the starting line of the metric
 * @param startCol the starting column of the metric
 * @param endLine the ending line of the metric
 * @param endCol the ending column of the metric
 */
export interface Location {
    startLine: number;
    startCol: number;
    endLine: number;
    endCol: number;
}
/**
 * Converts an ESLint location into a metric location
 * @param loc the ESLint location to convert
 * @returns the converted location
 */
export declare function convertLocation(loc: estree.SourceLocation): Location;
