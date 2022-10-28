import template from './lib/ChangeCoOwnerOfVehicleTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { ChangeCoOwnerOfVehicle } from './lib/dataSchema'
export type ChangeCoOwnerOfVehicleAnswers = ChangeCoOwnerOfVehicle

export default template
