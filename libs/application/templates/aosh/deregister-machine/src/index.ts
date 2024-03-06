import template from './lib/DeregisterMachineTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields')
export const getDataProviders = () => import('./dataProviders')

export type DeregisterMachineAnswers = MachineAnswers

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'
export default template
