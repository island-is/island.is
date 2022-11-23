import { CssAnalysisInput, CssAnalysisOutput } from './analysis';
/**
 * Analyzes a CSS analysis input
 *
 * Analyzing a CSS analysis input is rather straighforward. All that is needed
 * is to create a Stylelint configuration based on the rules from the active
 * quality profile and uses this configuration to linter the input file.
 *
 * @param input the CSS analysis input to analyze
 * @returns a promise of the CSS analysis output
 */
export declare function analyzeCSS(input: CssAnalysisInput): Promise<CssAnalysisOutput>;
