import template from './lib/template'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export { prereqMessages } from './lib/messages/prereqMessages'

export default template
