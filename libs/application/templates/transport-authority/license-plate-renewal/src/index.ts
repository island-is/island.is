import template from './lib/LicensePlateRenewalTemplate'
import { LicensePlateRenewal } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type LicensePlateRenewalAnswers = LicensePlateRenewal

export * from './utils'
export * from './lib/messages/error'
export * from './lib/messages/applicationCheck'

export default template
