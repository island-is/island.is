import { SourceCode } from 'eslint';
import { EmbeddedJS } from 'parsing/yaml';
import { APIError } from 'errors';
/**
 * Patches the ESLint SourceCode instance parsed with an ESLint-based parser
 *
 * Patching an ESLint SourceCode instance denoting an embedded JavaScript snippet implies
 * fixing all location-related data structures in the abstract syntax tree as well as the
 * behavior of the instance methods because they are relative to the beginning of the code
 * snippet that was parsed, not relative to the whole YAML file content. By doing so,
 * location-related information within reported issues and quick fixes will be relative to
 * the YAML file (YAML referential).
 */
export declare function patchSourceCode(originalSourceCode: SourceCode, embeddedJS: EmbeddedJS): SourceCode;
/**
 * Patches a parsing error in an embedded JavaScript snippet
 *
 * Patching a parsing error in such a snippet requires patching the line number of the error
 * as well as its message if it includes location information like a token position. At this,
 * point, location information in the parsing error is relative to the beginning of the code
 * snippet, which should be patched.
 */
export declare function patchParsingError(parsingError: APIError, embeddedJS: EmbeddedJS): APIError;
/**
 * Patches the message of a parsing error in an embedded JavaScript snippet
 *
 * A parsing error reported by an ESLint-based parser generally includes location information
 * about an unexpected token, e.g., `Unexpected token ','. (7:22)`, which should be patched.
 */
export declare function patchParsingErrorMessage(message: string, patchedLine: number, embeddedJS: EmbeddedJS): string;
