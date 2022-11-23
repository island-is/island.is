/**
 * An analysis function
 *
 * Every analysis consumes an input and produces an output regardless of whether
 * the analysis denotes a CSS analysis, a JavaScript one or another kind.
 *
 * _The return type is a JavaScript Promise to have a common API between all
 * types of analysis, especially because of CSS analyses which uses Stylelint._
 */
export declare type Analysis = (input: AnalysisInput) => Promise<AnalysisOutput>;
/**
 * An analysis input
 *
 * An analysis always operates on a file, be it from its path
 * or its content for any type of analysis.
 *
 * @param filePath the path of the file to analyze
 * @param fileContent the content of the file to analyze
 */
export interface AnalysisInput {
    filePath: string;
    fileContent: string | undefined;
    linterId?: string;
}
/**
 * An analysis output
 *
 * A common interface for all kinds of analysis output.
 */
export interface AnalysisOutput {
}
