import template from './lib/TransferOfVehicleOwnershipTemplate'
import { TransferOfVehicleOwnership } from './lib/dataSchema'
import * as appMessages from './lib/messages'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export const messages = appMessages

export type TransferOfVehicleOwnershipAnswers = TransferOfVehicleOwnership

export * from './utils'

export default template
