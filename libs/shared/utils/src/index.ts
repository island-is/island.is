/**
 * This file exports utils that are compatible on the browser
 * (or handle server side as well, e.g. isRunningOnEnvironment).
 */
export { getActiveEnvironment,isRunningOnEnvironment } from './lib/environment'
export { getStaticEnv } from './lib/getStaticEnv'
export { shouldLinkOpenInNewWindow } from './lib/shouldLinkOpenInNewWindow'
