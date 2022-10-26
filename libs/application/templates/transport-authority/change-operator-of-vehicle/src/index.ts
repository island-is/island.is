import template from './lib/ChangeOperatorOfVehicleTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { ChangeOperatorOfVehicle } from './lib/dataSchema'
export type ChangeOperatorOfVehicleAnswers = ChangeOperatorOfVehicle

export default template
