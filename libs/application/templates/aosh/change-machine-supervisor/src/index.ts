import template from './lib/ChangeMachineSupervisorTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export * from './lib/messages'

export type ChangeMachineSupervisorAnswers = MachineAnswers

export * from './utils'
export default template
