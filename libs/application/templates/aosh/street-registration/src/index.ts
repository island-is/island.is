import template from './lib/StreetRegistrationTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export type StreetRegistrationAnswers = MachineAnswers

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'
export * from './lib/messages/error'
export default template
