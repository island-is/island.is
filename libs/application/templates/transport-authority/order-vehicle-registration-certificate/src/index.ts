import template from './lib/OrderVehicleRegistrationCertificateTemplate'
import { OrderVehicleRegistrationCertificate } from './lib/dataSchema'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

export type OrderVehicleRegistrationCertificateAnswers = OrderVehicleRegistrationCertificate

export * from './utils'

export default template
