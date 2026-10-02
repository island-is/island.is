import template from './lib/HealthcareLicenseCertificateTemplate'
import { HealthcareLicenseCertificate } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export * from './lib/messages'

export type HealthcareLicenseCertificateAnswers = HealthcareLicenseCertificate

export * from './utils'

export default template
