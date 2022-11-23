import { YamlAnalysisInput, YamlAnalysisOutput } from './analysis';
/**
 * An empty YAML analysis output
 */
export declare const EMPTY_YAML_ANALYSIS_OUTPUT: YamlAnalysisOutput;
/**
 * Analyzes a YAML analysis input
 *
 * Analyzing a YAML analysis input is part of analyzing inline JavaScript code
 * within various file formats, YAML here. The function first starts by parsing
 * the YAML fle to validate its syntax and to get in return an abstract syntax
 * tree. This abstract syntax tree is then used to extract embedded JavaScript
 * code. As YAML files might embed several JavaScript snippets, the function
 * builds an ESLint SourceCode instance for each snippet using the same utility
 * as for building source code for regular JavaScript analysis inputs. However,
 * since a YAML file can potentially produce multiple ESLint SourceCode instances,
 * the function stops to the first JavaScript parsing error and returns it without
 * considering any other. If all abstract syntax trees are valid, the function
 * then proceeds with linting each of them, aggregates, and returns the results.
 *
 * The analysis requires that global linter wrapper is initialized.
 *
 * @param input the YAML analysis input
 * @returns the YAML analysis output
 */
export declare function analyzeYAML(input: YamlAnalysisInput): YamlAnalysisOutput;
