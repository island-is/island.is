import template from './lib/TransferOfMachineOwnershipTemplate'
import { MachineAnswers } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type TransferOfMachineOwnerShipAnswers = MachineAnswers

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'

export default template
