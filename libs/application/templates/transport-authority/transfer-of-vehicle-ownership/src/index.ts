import template from './lib/TransferOfVehicleOwnershipTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { TransferOfVehicleOwnership } from './lib/dataSchema'
export type TransferOfVehicleOwnershipAnswers = TransferOfVehicleOwnership

export default template
