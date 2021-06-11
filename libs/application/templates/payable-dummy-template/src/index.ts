import PayableDummyTemplate from './lib/PayableDummyTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default PayableDummyTemplate
