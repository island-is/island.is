import PublicDebtPaymentPlanTemplate from './lib/PublicDebtPaymentPlanTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export * from './lib/messages'

export type { PrerequisitesResult } from './types'
export default PublicDebtPaymentPlanTemplate
