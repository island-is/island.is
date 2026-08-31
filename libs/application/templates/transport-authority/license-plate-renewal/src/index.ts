import template from './lib/LicensePlateRenewalTemplate'
import { LicensePlateRenewal } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export * from './lib/messages'

export type LicensePlateRenewalAnswers = LicensePlateRenewal

export * from './utils'

export default template
