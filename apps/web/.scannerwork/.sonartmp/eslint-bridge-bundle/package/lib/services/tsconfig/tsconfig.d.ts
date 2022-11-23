import * as ts from 'typescript';
/**
 * Gets the files resolved by a TSConfig
 *
 * The resolving of the files for a given TSConfig file is done
 * by invoking TypeScript compiler.
 *
 * @param tsConfig TSConfig to parse
 * @param parseConfigHost parsing configuration
 * @returns the resolved TSConfig files
 */
export declare function getFilesForTsConfig(tsConfig: string, parseConfigHost?: ts.ParseConfigHost): {
    files: string[];
    projectReferences: string[];
};
