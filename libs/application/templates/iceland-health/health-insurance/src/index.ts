import HealthInsuranceTemplate from './lib/HealthInsuranceTemplate'

export const getDataProviders = () => import('./dataProviders')

export type { ExternalDataNationalRegistry } from './utils/types'

export * from './lib/messages'

export default HealthInsuranceTemplate
