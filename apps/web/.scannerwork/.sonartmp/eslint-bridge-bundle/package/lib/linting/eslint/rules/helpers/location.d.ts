import * as estree from 'estree';
import { AST } from 'eslint';
import { TSESTree } from '@typescript-eslint/experimental-utils';
export declare type LocationHolder = AST.Token | TSESTree.Node | estree.Node | {
    loc: AST.SourceLocation;
};
/**
 * Encodes an ESLint descriptor message with secondary locations
 *
 * The encoding consists in stringifying a JavaScript object with
 * `JSON.stringify` that includes the ESLint's descriptor message
 * along with second location information: message and location.
 *
 * This encoded message is eventually decoded by the linter wrapper
 * on the condition that the rule definition of the flagged problem
 * defines the internal `sonar-runtime` parameter in its schema.
 *
 * @param message the ESLint descriptor message
 * @param secondaryLocationsHolder the secondary locations
 * @param secondaryMessages the messages for each secondary location
 * @param cost the optional cost to fix
 * @returns the encoded message with secondary locations
 */
export declare function toEncodedMessage(message: string, secondaryLocationsHolder?: Array<LocationHolder>, secondaryMessages?: (string | undefined)[], cost?: number): string;
