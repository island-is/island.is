import { QuickFix } from '../quickfixes';
import { Location } from './location';
/**
 * A SonarQube-compatible source code issue
 *
 * It is used to send back a JS/TS analysis response to the plugin, which
 * eventually saves the issue data to SonarQube.
 *
 * @param ruleId the rule key
 * @param line the issue starting line
 * @param column the issue starting column
 * @param endLine the issue ending line
 * @param endColumn the issue ending column
 * @param message the issue message
 * @param cost the cost to fix the issue
 * @param secondaryLocations the issue secondary locations
 * @param quickFixes the issue quick fixes
 */
export interface Issue {
    ruleId: string;
    line: number;
    column: number;
    endLine?: number;
    endColumn?: number;
    message: string;
    cost?: number;
    secondaryLocations: Location[];
    quickFixes?: QuickFix[];
}
