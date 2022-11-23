import express from 'express';
/**
 * Handles initialization requests of the global ESLint linter wrappers
 *
 * The bridge relies on a global ESLint linter wrapper for JavaScript
 * and TypeScript analysis. Before any analysis, the linter wrapper
 * must be initialized explicitly, which includes the rules from the
 * active quality profile the linter must consider as well as global
 * variables ann JavaScript execution environments.
 */
export default function (request: express.Request, response: express.Response): void;
