import template from './lib/ResidencePermitRenewalTemplate'
import { ResidencePermitRenewal } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type ResidencePermitRenewalAnswers = ResidencePermitRenewal

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/error'

export default template
