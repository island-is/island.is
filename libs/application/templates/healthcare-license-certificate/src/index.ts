import template from './lib/HealthcareLicenseCertificateTemplate'
import { HealthcareLicenseCertificate } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type HealthcareLicenseCertificateAnswers = HealthcareLicenseCertificate

export * from './utils'
// export * from './shared/types'

export * from './lib/messages/externalData'
export * from './lib/messages/error'

export default template
