/**
 * A SonarQube-compatible stylesheet issue
 *
 * Stylelint linting results only include partial location information,
 * namely starting line and starting column.
 *
 * It is used to send back a CSS analysis response to the plugin, which
 * eventually saves the issue data to SonarQube.
 *
 * @param ruleId the rule key
 * @param line the issue line
 * @param column the issue column
 * @param message the issue message
 */
export interface Issue {
    ruleId: string;
    line: number;
    column: number;
    message: string;
}
