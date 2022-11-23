"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY_JSTS_ANALYSIS_OUTPUT = exports.errorMiddleware = void 0;
const errors_1 = require("errors");
/**
 * Express.js middleware for handling error while serving requests.
 *
 * The purpose of this middleware is to catch any error occuring within
 * the different layers of the bridge to centralize and customize error
 * information that is sent back.
 *
 * The fourth parameter is necessary to identify this as an error middleware.
 * @see https://expressjs.com/en/guide/error-handling.html
 */
function errorMiddleware(error, _request, response, _next) {
    const { code, message, data } = error instanceof errors_1.APIError ? error : errors_1.APIError.unexpectedError(error.message);
    switch (code) {
        case errors_1.ErrorCode.Parsing:
            response.json({
                parsingError: {
                    message,
                    code,
                    line: data === null || data === void 0 ? void 0 : data.line,
                },
                ...exports.EMPTY_JSTS_ANALYSIS_OUTPUT,
            });
            break;
        case errors_1.ErrorCode.FailingTypeScript:
        case errors_1.ErrorCode.LinterInitialization:
            response.json({
                parsingError: {
                    message,
                    code,
                },
            });
            break;
        default:
            console.error(error.stack);
            response.json({ error: error.message });
            break;
    }
}
exports.errorMiddleware = errorMiddleware;
/**
 * An empty JavaScript / TypeScript analysis output sent back on paring errors.
 */
exports.EMPTY_JSTS_ANALYSIS_OUTPUT = {
    issues: [],
    highlights: [],
    highlightedSymbols: [],
    metrics: {
        ncloc: [],
        commentLines: [],
        nosonarLines: [],
        executableLines: [],
        functions: 0,
        statements: 0,
        classes: 0,
        complexity: 0,
        cognitiveComplexity: 0,
    },
    cpdTokens: [],
    perf: {
        parseTime: 0,
        analysisTime: 0,
    },
};
//# sourceMappingURL=middleware.js.map