import FinancialAidTemplate from './lib/FinancialAidTemplate'

export * from './lib/FinancialAidTemplate'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export * from './lib/types'

export * from './lib/utils'

export default FinancialAidTemplate
