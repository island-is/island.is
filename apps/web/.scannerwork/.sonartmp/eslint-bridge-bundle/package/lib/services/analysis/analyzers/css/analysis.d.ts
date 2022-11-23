import { Issue, RuleConfig } from 'linting/stylelint';
import { AnalysisInput, AnalysisOutput } from 'services/analysis';
/**
 * A CSS analysis input
 *
 * A CSS analysis input only needs an input file and a set
 * of rule configurations to analyze a stylesheet.
 *
 * @param rules the rules from the active quality profile
 */
export interface CssAnalysisInput extends AnalysisInput {
    rules: RuleConfig[];
}
/**
 * A CSS analysis output
 *
 * Computing data analysis like metrics does nit realy makes
 * sense in the context of stylesheets. Therefore, only issues
 * form the content of a CSS analysis output beside an analysis
 * error.
 *
 * @param issues
 */
export interface CssAnalysisOutput extends AnalysisOutput {
    issues: Issue[];
}
