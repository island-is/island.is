import ChildrenResidenceChangeTemplate from './lib/ChildrenResidenceChangeTemplate'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export * from './types'
export * from './lib/utils'

export default ChildrenResidenceChangeTemplate
