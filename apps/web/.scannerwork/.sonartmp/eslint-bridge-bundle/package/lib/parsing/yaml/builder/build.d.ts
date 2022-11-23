import { SourceCode } from 'eslint';
export declare type ExtendedSourceCode = SourceCode & {
    syntheticFilePath: string;
};
/**
 * Builds ESLint SourceCode instances for every embedded JavaScript snippet in the YAML file.
 *
 * The filepath is augmented with the AWS function name, returned as the syntheticFilePath property
 *
 * If there is at least one parsing error in any snippet, we return only the first error and
 * we don't even consider any parsing errors in the remaining snippets for simplicity.
 */
export declare function buildSourceCodes(filePath: string): ExtendedSourceCode[];
/**
 * Returns the filename composed as following:
 *
 * {filepath-without-extention}-{resourceName}{filepath-extension}
 */
export declare function composeSyntheticFilePath(filePath: string, resourceName: string): string;
