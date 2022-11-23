import stylelint from 'stylelint';
import { Issue } from './issue';
/**
 * Transforms Stylelint linting results into SonarQube issues
 * @param results the Stylelint linting results
 * @param filePath the path of the linted file
 * @returns the transformed SonarQube issues
 */
export declare function transform(results: stylelint.LintResult[], filePath: string): Issue[];
