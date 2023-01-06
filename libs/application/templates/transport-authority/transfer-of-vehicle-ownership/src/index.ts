import template from './lib/TransferOfVehicleOwnershipTemplate'
import { TransferOfVehicleOwnership } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type TransferOfVehicleOwnershipAnswers = TransferOfVehicleOwnership

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'

export default template
