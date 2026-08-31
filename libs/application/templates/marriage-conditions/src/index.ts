import MarriageConditionsTemplate from './lib/MarriageConditionsTemplate'
export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export * from './lib/messages'

export default MarriageConditionsTemplate
