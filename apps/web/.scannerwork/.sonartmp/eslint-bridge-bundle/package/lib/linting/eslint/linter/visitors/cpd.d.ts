import { SourceCode } from 'eslint';
import { Location } from './metrics/helpers';
/**
 * A copy-paste detector token (cpd)
 *
 * A cpd token is used by SonarQube to compute code duplication
 * within a code base. It relies on a token location as well as
 * an image, that is, the token value except for string literal
 * which is anonymised to extend the scope of what a duplicated
 * code pattern can be.
 *
 * @param location the token location
 * @param image the token
 */
export interface CpdToken {
    location: Location;
    image: string;
}
/**
 * Extracts the copy-paste detector (cpd) tokens
 * @param sourceCode the source code to extract from
 * @returns the cpd tokens
 */
export declare function getCpdTokens(sourceCode: SourceCode): {
    cpdTokens: CpdToken[];
};
