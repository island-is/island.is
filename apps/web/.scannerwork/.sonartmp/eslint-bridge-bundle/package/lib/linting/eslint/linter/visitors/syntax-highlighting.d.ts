import { SourceCode } from 'eslint';
import { Location } from './metrics/helpers';
/**
 * A syntax highlight
 *
 * A syntax highlight is used by SonarQube to display a source code
 * with syntax highlighting.
 *
 * @param location the highlight location
 * @param textType the highlight type
 */
export interface SyntaxHighlight {
    location: Location;
    textType: TextType;
}
/**
 * Denotes a highlight type of a token
 *
 * The set of possible values for a token highlight is defined by SonarQube, which
 * uses this value to decide how to highlight a token.
 */
export declare type TextType = 'CONSTANT' | 'COMMENT' | 'STRUCTURED_COMMENT' | 'KEYWORD' | 'STRING';
/**
 * Computes the syntax highlighting of an ESLint source code
 * @param sourceCode the source code to highlight
 * @returns a list of highlighted tokens
 */
export declare function getSyntaxHighlighting(sourceCode: SourceCode): {
    highlights: SyntaxHighlight[];
};
