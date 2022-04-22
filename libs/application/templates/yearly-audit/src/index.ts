import ReferenceApplicationTemplate from './lib/YearlyAudit'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default ReferenceApplicationTemplate
