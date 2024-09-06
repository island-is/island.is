import template from './lib/HealthcareWorkPermitTemplate'
import { HealthcareWorkPermit } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type HealthcareWorkPermitAnswers = HealthcareWorkPermit

export * from './utils'

export * from './lib/messages/externalData'
export * from './lib/messages/error'
export * from './lib/messages/information'
export * from './lib/types'

export default template
