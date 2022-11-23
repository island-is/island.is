import { Linter, SourceCode } from 'eslint';
import { Issue } from './issue';
/**
 * Converts an ESLint message into a SonarQube issue
 *
 * Converting an ESLint message into a SonarQube issue consists in extracting
 * the relevant properties from the message for the most of it. Furthermore,
 * it transforms ESLint fixes into SonarLint quick fixes, if any. On the other
 * hand, encoded secondary locations remain in the issue message at this stage
 * and are decoded in a subsequent step.
 *
 * @param source the source code
 * @param message the ESLint message to convert
 * @returns the converted SonarQube issue
 */
export declare function convertMessage(source: SourceCode, message: Linter.LintMessage): Issue | null;
