/**
 * This file exports utils that are compatible on the browser
 * (or handle server side as well, e.g. isRunningOnEnvironment).
 */
export { getStaticEnv } from './lib/getStaticEnv'
export { isRunningOnEnvironment, getActiveEnvironment } from './lib/environment'
