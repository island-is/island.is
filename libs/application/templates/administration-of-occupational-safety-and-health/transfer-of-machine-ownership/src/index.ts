//export * from './lib/application-templates-administration-of-occupational-safety-and-health-transfer-of-machine-ownership'
import template from './lib/TransferOfVehicleOwnershipTemplate'
//import template from './lib/application-templates-administration-of-occupational-safety-and-health-transfer-of-machine-ownership'
import {
  AdministrationOfOccupationalSafetyAndHealth,
  MachineAnswers,
} from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type AdministrationOfOccupationalSafetyAndHealthAnswers =
  AdministrationOfOccupationalSafetyAndHealth

export type TransferOfMachineOwnerShipAnswers = MachineAnswers

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'

export default template
