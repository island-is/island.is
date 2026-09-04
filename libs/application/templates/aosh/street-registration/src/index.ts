import template from './lib/StreetRegistrationTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export * from './lib/messages'

export type StreetRegistrationAnswers = MachineAnswers

export * from './utils'
export default template
