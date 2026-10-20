import PSignTemplate from './lib/pSignTemplate'
export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export * from './lib/messages'

export default PSignTemplate
