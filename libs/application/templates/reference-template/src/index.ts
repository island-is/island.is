import ReferenceApplicationTemplate from './lib/ReferenceApplicationTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')
export const getAPIActions = () => import('./apiActions/')

export default ReferenceApplicationTemplate
