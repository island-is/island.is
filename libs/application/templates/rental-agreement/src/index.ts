import RentalAgreementTemplate from './lib/RentalAgreementTemplate'
export * from './lib/RentalAgreementTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export * from './lib/types'
export * from './lib/utils'
export * as messages from './lib/messages'

export default RentalAgreementTemplate
