import template from './lib/RequestForInspectionTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export * from './lib/messages'

export type RequestInspectionAnswers = MachineAnswers

export * from './utils'
export * from './shared'
export default template
