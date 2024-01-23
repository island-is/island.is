import template from './lib/AdditionalSupportForTheElderlyTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields/')
export default template

export * from './lib/additionalSupportForTheElderlyUtils'
export * from './lib/messages'
