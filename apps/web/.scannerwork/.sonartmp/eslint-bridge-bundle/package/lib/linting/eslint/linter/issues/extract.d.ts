import { Issue } from './issue';
import { SymbolHighlight } from '../visitors';
/**
 * Extracts the symbol highlighting
 *
 * The linter enables the internal custom rule for symbol highlighting
 * which eventually creates an issue to this end. The issue encodes the
 * symbol highlighting as a serialized JSON object in its message, which
 * can safely be extracted if it exists in the list of returned issues
 * after linting.
 *
 * @param issues the issues to process
 * @returns the symbol highlighting
 */
export declare function extractHighlightedSymbols(issues: Issue[]): SymbolHighlight[];
/**
 * Extracts the cognitive complexity
 *
 * The linter enables the internal custom rule for cognitive complexity
 * which eventually creates an issue to this end. The issue encodes the
 * complexity as a number in its message, which can safely be extracted
 * if it exists in the list of returned issues after linting.
 *
 * @param issues the issues to process
 * @returns the cognitive complexity
 */
export declare function extractCognitiveComplexity(issues: Issue[]): number | undefined;
