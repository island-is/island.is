import template from './lib/OrderVehicleLicensePlateTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { OrderVehicleLicensePlate } from './lib/dataSchema'
export type OrderVehicleLicensePlateAnswers = OrderVehicleLicensePlate

export default template
