import FinancialStatementCemeteryTemplate from './lib/financialStatementCemeteryTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export * from './lib/messages'

export default FinancialStatementCemeteryTemplate
