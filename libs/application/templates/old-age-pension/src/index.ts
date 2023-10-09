import template from './lib/OldAgePensionTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export default template

export * from './lib/oldAgePensionUtils'
export * from './lib/messages'
export * from './lib/constants'
