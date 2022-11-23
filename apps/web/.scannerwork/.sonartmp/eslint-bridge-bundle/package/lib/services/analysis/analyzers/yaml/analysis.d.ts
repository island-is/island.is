import { Issue } from 'linting/eslint';
import { AnalysisInput, AnalysisOutput } from 'services/analysis';
/**
 * A YAML analysis input
 *
 * (currently empty but might change later on)
 */
export interface YamlAnalysisInput extends AnalysisInput {
}
/**
 * A YAML analysis output
 *
 * A YAML analysis only returns issues that were found during
 * linting. Because the JavaScript analyzer doesn't "own" the
 * `YAML` language, it cannot save anything else than issues
 * using SonarQube API, especially analysis data like metrics.
 *
 * @param issues the found issues
 */
export interface YamlAnalysisOutput extends AnalysisOutput {
    issues: Issue[];
    ucfgPaths?: string[];
}
