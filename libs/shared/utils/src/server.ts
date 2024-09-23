/**
 * This file exports utils that are only working on the server.
 *
 * In `createXRoadAPIPath`, for example, it's importing
 * '@island.is/logging' that's only working on the server side.
 */
export { XRoadMemberClass, createXRoadAPIPath } from './lib/createXRoadAPIPath'

export * from './lib/server/env'
export * from './lib/server/startProcess'
