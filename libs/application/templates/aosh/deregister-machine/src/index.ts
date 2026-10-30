import template from './lib/DeregisterMachineTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export * from './lib/messages'

export type DeregisterMachineAnswers = MachineAnswers

export * from './utils'
export default template
