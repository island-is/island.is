import template from './lib/IncomePlanTemplate'

export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields')

export default template

export * from './lib/incomePlanUtils'
export * from './lib/messages'
export * from './lib/constants'
