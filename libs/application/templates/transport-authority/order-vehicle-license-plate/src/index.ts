import template from './lib/OrderVehicleLicensePlateTemplate'
import { OrderVehicleLicensePlate } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type OrderVehicleLicensePlateAnswers = OrderVehicleLicensePlate

export * from './utils'
export * from './lib/messages/externalData'
export * from './lib/messages/applicationCheck'

export default template
