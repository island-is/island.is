/**
 * An issue location container
 *
 * It is used for quick fixes and secondary locations.
 *
 * @param line the issue starting line
 * @param column the issue starting column
 * @param endLine the issue ending line
 * @param endColumn the issue ending column
 * @param message the issue message
 */
export interface Location {
    line: number;
    column: number;
    endLine: number;
    endColumn: number;
    message?: string;
}
