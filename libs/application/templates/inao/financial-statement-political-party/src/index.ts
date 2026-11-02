import FinancialStatementPoliticalPartyTemplate from './lib/financialStatementPoliticalPartyTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export * from './lib/messages'

export default FinancialStatementPoliticalPartyTemplate
