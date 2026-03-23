import template from './lib/RegistrationOfNewPropertyNumbersTemplate'
export * from './lib/dataSchema'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields/')

export { prereqMessages } from './lib/messages/prereqMessages'

export default template
