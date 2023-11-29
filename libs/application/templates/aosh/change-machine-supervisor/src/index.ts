import template from './lib/ChangeMachineSupervisorTemplate'
import {
  ChangeOperatorOfVehicle,
  ChangeOperatorOfVehicleSchema,
} from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type ChangeMachineSupervisorAnswers = ChangeOperatorOfVehicle // TODO: Change this to the correct schema

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'

export default template
