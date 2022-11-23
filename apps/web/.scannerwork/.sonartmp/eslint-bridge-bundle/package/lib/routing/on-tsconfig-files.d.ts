import express from 'express';
/**
 * Handles TSConfig files resolving requests
 *
 * TSConfig-based analysis either for JavaScript or TypeScript requires first
 * resolving the files to be analyzed based on provided TSConfigs. The logic
 * of the whole resolving lies in the bridge since it includes and bundles
 * TypeScript dependency, which is able to parse and analyze TSConfig files.
 */
export default function (request: express.Request, response: express.Response, next: express.NextFunction): void;
