import ReferenceApplicationTemplate from './lib/ReferenceApplicationTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')
export const getAPIModule = () => import('./apiModule/')

export default ReferenceApplicationTemplate
