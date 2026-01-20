import RentalAgreementTemplate from './lib/RentalAgreementTemplate'
export * from './lib/RentalAgreementTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export * from './utils/types'
export * from './utils/utils'
export * from './shared'
export * as messages from './lib/messages'

export default RentalAgreementTemplate
