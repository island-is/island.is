import template from './lib/PensionSupplementTemplate'

export const getDataProviders = () => import('./dataProviders')
export const getFields = () => import('./fields')

export default template
