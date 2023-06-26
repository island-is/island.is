import FinancialStatementsInaoApplicationTemplate from './lib/financialStatementsInao'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default FinancialStatementsInaoApplicationTemplate
