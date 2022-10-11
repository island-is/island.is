import ChildrenResidenceChangeTemplate from './lib/ChildrenResidenceChangeTemplate'

export const getDataProviders = () => import('./dataProviders/')

export const getFields = () => import('./fields/')

export * from './types'

export { noChildren } from './lib/messages'

export default ChildrenResidenceChangeTemplate
