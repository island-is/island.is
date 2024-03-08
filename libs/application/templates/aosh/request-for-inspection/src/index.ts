import template from './lib/RequestForInspectionTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export type RequestInspectionAnswers = MachineAnswers

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'
export default template
