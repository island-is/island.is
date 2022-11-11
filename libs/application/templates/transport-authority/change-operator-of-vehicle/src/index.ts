import template from './lib/ChangeOperatorOfVehicleTemplate'
import { ChangeOperatorOfVehicle } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type ChangeOperatorOfVehicleAnswers = ChangeOperatorOfVehicle

export * from './utils'

export default template
