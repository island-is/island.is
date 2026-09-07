import template from './lib/template'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export { meetsAdditionalLicenseRequirements } from './utils'
export { m as messages } from './lib/messages'
export type { DrivingLicenseFakeData } from './utils'

export default template
