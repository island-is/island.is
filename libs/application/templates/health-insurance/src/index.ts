import HealthInsuranceTemplate from './lib/HealthInsuranceTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export type { ExternalDataNationalRegistry } from './types'

export default HealthInsuranceTemplate
