import ts from 'typescript';
/**
 * Gets an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to retrieve
 * @throws a runtime error if there is no such program
 * @returns the retrieved TypeScript's Program
 */
export declare function getProgramById(programId: string): ts.Program;
/**
 * Creates a TypeScript's Program instance
 *
 * TypeScript creates a Program instance per TSConfig file. This means that one
 * needs a TSConfig to create such a program. Therefore, the function expects a
 * TSConfig as an input, parses it and uses it to create a TypeScript's Program
 * instance. The program creation delegates to TypeScript the resolving of input
 * files considered by the TSConfig as well as any project references.
 *
 * @param inputTSConfig the TSConfig input to create a program for
 * @returns the identifier of the created TypeScript's Program along with the
 *          resolved files and project references
 */
export declare function createProgram(inputTSConfig: string): {
    programId: string;
    files: string[];
    projectReferences: string[];
};
/**
 * Deletes an existing TypeScript's Program by its identifier
 * @param programId the identifier of the TypeScript's Program to delete
 */
export declare function deleteProgram(programId: string): void;
