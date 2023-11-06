/**
 * This file exports utils that are compatible on the browser
 * (or handle server side as well, e.g. isRunningOnEnvironment).
 */
export { getStaticEnv } from './lib/getStaticEnv'
export { sleep } from './lib/sleep'
export { isRunningOnEnvironment } from './lib/environment'
export { shouldLinkOpenInNewWindow } from './lib/shouldLinkOpenInNewWindow'
export { getOrganizationLogoUrl } from './lib/getOrganizationLogoUrl'
export { checkDelegation } from './lib/isDelegation'
export { isDefined } from './lib/isDefined'
export { storageFactory } from './lib/storageFactory'
export { sortAlpha } from './lib/sortAlpha'
export { stringHash } from './lib/stringHash'
export { getCountryByCode } from './lib/countries'
export { getDocument } from './lib/getDocument'
export type { Country } from './lib/countries'
export * from './lib/date'
