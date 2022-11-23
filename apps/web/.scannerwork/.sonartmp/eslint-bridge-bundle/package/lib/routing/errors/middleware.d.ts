import express from 'express';
import { JsTsAnalysisOutput } from 'services/analysis';
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
export declare function errorMiddleware(error: Error, _request: express.Request, response: express.Response, _next: express.NextFunction): void;
/**
 * An empty JavaScript / TypeScript analysis output sent back on paring errors.
 */
export declare const EMPTY_JSTS_ANALYSIS_OUTPUT: JsTsAnalysisOutput;
