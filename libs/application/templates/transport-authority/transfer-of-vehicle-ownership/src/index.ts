import template from './lib/TransferOfVehicleOwnershipTemplate'
import { TransferOfVehicleOwnership } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type TransferOfVehicleOwnershipAnswers = TransferOfVehicleOwnership

export { States as TransferOfVehicleOwnershipStates } from './lib/constants'

export default template
