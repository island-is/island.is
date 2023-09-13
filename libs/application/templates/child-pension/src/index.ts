import template from './lib/ChildPensionTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default template

export * from './lib/childPensionUtils'
export * from './lib/messages'
