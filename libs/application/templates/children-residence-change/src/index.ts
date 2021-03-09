import ChildrenResidenceChangeTemplate from './lib/ChildrenResidenceChangeTemplate'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export * from './dataProviders/APIDataTypes'

export default ChildrenResidenceChangeTemplate
