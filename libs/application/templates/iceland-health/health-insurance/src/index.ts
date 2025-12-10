import HealthInsuranceTemplate from './lib/HealthInsuranceTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export type { ExternalDataNationalRegistry } from './utils/types'
export { errorMessages } from './lib/messages/errorMessages'
export default HealthInsuranceTemplate
