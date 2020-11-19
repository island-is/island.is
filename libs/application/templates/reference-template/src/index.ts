import ReferenceApplicationTemplate from './lib/ReferenceApplicationTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default ReferenceApplicationTemplate
