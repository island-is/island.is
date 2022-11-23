/**
 * The possible codes of analysis errors
 *
 * The `Unexpected` value denotes a runtime error which is either
 * unpredictable or occurs rarely to deserve its own category.
 */
export declare enum ErrorCode {
    Parsing = "PARSING",
    FailingTypeScript = "FAILING_TYPESCRIPT",
    Unexpected = "GENERAL_ERROR",
    LinterInitialization = "LINTER_INITIALIZATION"
}
export interface ErrorData {
    line: number;
}
export declare class APIError extends Error {
    code: ErrorCode;
    data?: ErrorData;
    private constructor();
    /**
     * Builds a failing TypeScript error.
     */
    static failingTypeScriptError(message: string): APIError;
    /**
     * Builds a linter initialization error.
     */
    static linterError(message: string): APIError;
    /**
     * Builds a parsing error.
     */
    static parsingError(message: string, data: ErrorData): APIError;
    /**
     * Builds an unexpected runtime error.
     */
    static unexpectedError(message: string): APIError;
}
