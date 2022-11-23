/**
 * A container of performance information
 *
 * It is used for analysis monitoring purpose.
 *
 * @param parseTime the parsing time
 * @param analysisTime the analysis time
 */
export interface Perf {
    parseTime: number;
    analysisTime: number;
}
