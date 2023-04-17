import template from './lib/ResidencePermitPermanentTemplate'
import { ResidencePermitPermanent } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type ResidencePermitPermanentAnswers = ResidencePermitPermanent

export * from './utils'
export * from './lib/messages/externalData'

export default template
