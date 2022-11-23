import express from 'express';
/**
 * Express.js middleware that timeouts after a lapse of time and triggers a function.
 * @param f the timeout function
 * @param delay the timeout delay
 * @returns the timeout middleware with capability to stop the internal timeout
 */
export declare function timeoutMiddleware(f: () => void, delay: number): {
    middleware(_request: express.Request, response: express.Response, next: express.NextFunction): void;
    stop(): void;
};
