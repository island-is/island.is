import template from './lib/HealthcareWorkPermitTemplate'
import { HealthcareWorkPermit } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export * from './lib/messages'

export type HealthcareWorkPermitAnswers = HealthcareWorkPermit

export * from './utils'

export * from './lib/types'

export default template
