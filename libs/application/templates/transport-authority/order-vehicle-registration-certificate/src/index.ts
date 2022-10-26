import template from './lib/OrderVehicleRegistrationCertificateTemplate'

export const getFields = () => import('./fields/')
export const getDataProviders = () => import('./dataProviders/')

import { OrderVehicleRegistrationCertificate } from './lib/dataSchema'
export type OrderVehicleRegistrationCertificateAnswers = OrderVehicleRegistrationCertificate

export default template
