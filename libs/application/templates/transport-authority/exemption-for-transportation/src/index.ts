import ExemptionForTransportationTemplate from './lib/ExemptionForTransportationTemplate'
import { ExemptionForTransportation } from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders/')

export type ExemptionForTransportationAnswers = ExemptionForTransportation

export * from './shared'
export * from './lib/messages/error'

export default ExemptionForTransportationTemplate
